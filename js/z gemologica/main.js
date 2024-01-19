/* eslint-disable no-regex-spaces */

import constants from './constants.js'
import sorttable from './sortTable.js'
import tablePropsJs from './tableProps.js'

const TOOLTIP_MAX_CANDIDATE_TROOPS = 10
const TOOLTIP_MAX_TROOPS_WITH_COPIES_NEEDED = 7

const MANA_ICONS = [
	'small_blue',
	'small_green',
	'small_red',
	'small_yellow',
	'small_purple',
	'small_brown',
	'doomskull',
]

const SHORTEN_TASK_NAMES = [
	// Troops
	[/(Collect)(.*)({Kingdom} troops)/, 'Collect$2troops'],
	[/(Collect)(.*)(Epic troops from {Kingdom})/, 'Collect$2Epics'],
	[/(Collect)(.*)(Epic troop from {Kingdom})/, 'Collect$2Epic'],
	[/(Collect)(.*)(Legendary troops from {Kingdom})/, 'Collect$2Legendaries'],
	[/(Collect)(.*)(Legendary troop from {Kingdom})/, 'Collect$2Legendary'],
	[/(Collect)(.*)(Mythic troops from {Kingdom})/, 'Collect$2Mythics'],
	[/(Collect)(.*)(Mythic troop from {Kingdom})/, 'Collect$2Mythic'],

	[/(Upgrade a {Kingdom} troop to level)(.*)/, 'Level a troop to$2'],
	[/(Upgrade)(.*)({Kingdom} troops to level)(.*)/, 'Level$2troops to$4'],
	[/(Level)(.*)({Kingdom} troops to level)(.*)/, 'Level$2troops to$4'],

	[/(Unlock 3 Traits on)(.*)({Kingdom} troops)/, 'Trait$2troops'],
	[/(Upgrade)(.*)({Kingdom} troops to Elite Level)(.*)/, 'Medal $2 troops to $4'],
	// Kingdom
	[/(Complete the Tier)(.*)(Trial battle)/, 'Complete tier$2trial'],
	[/(Complete all the Quests)/, 'Complete quests'],
	[/(Upgrade {Kingdom} to level)/, 'Kingdom level'],
	[/(Level {Kingdom} to level)/, 'Kingdom level'],
	[/(Earn)(.*)(Faction Renown in the Faction {Kingdom})/, '$2 faction renown'],
	// Weapons
	[/(Collect a weapon from {Kingdom})/, 'Collect a weapon'],
	[/(Collect)(.*)(weapons from {Kingdom})/, 'Collect$2weapons'],
	[/(Collect)(.*)({Kingdom} weapons)/, 'Collect$2weapons'],
	[/(Fully upgrade a weapon from.*)/, 'Upgrade a weapon'],
	[/(Fully upgrade)(.*)({Kingdom} weapons)/, 'Upgrade$2weapons'],
	// Class
	[/(Unlock 3 Traits on)(.*)/, 'Trait$2'],
	[/(Upgrade the  class to level)(.*)/, 'Level the  class to$2'],
	[/(Reach Champion Level)(.*)(on the  class)/, 'the  class champ level$2'],
	// Pets
	[/(Collect a {Kingdom} pet)/, 'Collect a pet'],
	[/(Collect a pet from {Kingdom})/, 'Collect a pet'],
	[/(Collect)(.*)({Kingdom} pets)/, 'Collect$2pets'],
	[/(Upgrade a {Kingdom} pet to level)(.*)/, 'Level a pet to$2'],
	[/(Upgrade)(.*)({Kingdom} pets to level)(.*)/, 'Level$2pets to$4'],
]
const LABEL_LEVEL = 'Level '
const TOOLTIP_HEADER_UPGRADEABLE = 'Troops upgradeable now (example):'
const TOOLTIP_HEADER_TRAITABLE = 'Troops traitable now (example):'
const TOOLTIP_CANDIDATES = 'Candidates:'
const TOOLTIP_CANDIDATES_AT_LEAST = 'Candidates (at least):'
const TOOLTIP_MISSING = 'Missing:'
const TOOLTIP_MISSING_COPIES = 'Missing copies:'
const TOOLTIP_FEWEST_MISSING_COPIES = 'Fewest missing copies:'
const TOOLTIP_FACTION_TROOPS_RARITY = 'Faction troops not at required rarity:'
const TOOLTIP_FACTION_TROOPS_MISSING = 'Missing faction troops:'
const TOOLTIP_TROOP_ASCENDABLE = 'Levelable!'
const RARITY_LABELS = ['', '(C)', '(R)', '(U)', '(E)', '(L)', '(M)', '(D)']
const AVG_TRIBUTE_LABEL =
	'Expected average tribute (assuming guild statues at level 100+, ignoring home kingdom setting): '
const TOOLTIP_NO_WEAPON_DATA = '(Cannot detect ownership<br>if a weapon has no upgrades)'
const TOOLTIP_TASK_LOCKED = 'Not achievable yet'
const TOOLTIP_TASK_UNLOCKED_ON = 'Expected to become achievable on '
const TOOLTIP_FUTURE_POWER_LEVELS = 'Expected to increase to <b>$p</b> on $d'
const TOOLTIP_HOARD_MASTER =
	'Planning to upgrade your treasure hoard?' +
	'<br>Find the optimal hoard upgrade strategy' +
	'<br>tailored to your treasure budget' +
	'<br>and save thousands of gold today' +
	'<br>with <b><a href="http://el-hackerino.github.io/hoard-master" target="_blank" rel="noopener noreferrer">Hoard Master</a></b>!'
const SPAN_CHECK = '<span class="check">&#x2713;</span>'
const SPAN_UNCHECK = '<span class="uncheck">&#x2717;</span>'
const SPAN_UNKNOWN = '<span class="unknown">?</span>'
const SPAN_UPGRADE = '<span class="upgrade"></span>'
const SPAN_UPGRADE_DUMMY = '<span class="upgradeDummy">&nbsp;</span>'
const SPAN_FUTURE_POWER_DUMMY = '<span class="futurePowerDummy">&nbsp;</span>'
const SPAN_FUTURE_POWER = '<span class="futurePower">+</span>'
const TOOLTIP_UPGRADE = 'You can upgrade to power <b>$p</b> using your current resources (cannot check souls though).'
const TOOLTIP_UNASSIGNED_TALENTS = 'This class has unassigned talents!'
const TOOLTIP_COSMETIC_PET = 'Cosmetic/event pet, not available from pet gnomes'
const HELP_PAGES = ['help', 'whatsNew', 'about']
const CLASS_PSEUDO_KINGDOM = 'pseudoKingdom'

let BETA_FEATURES = 0 // Triggered by adding the URL param "beta"
let DEV_FEATURES = 0 // Triggered by adding the URL param "dev"
let data = {}

const PAGES = ['main', 'ts', 'ach']
const BACKGROUNDS = ['tableBackground', 'tsBackground', 'achBackground']
const PAGE_ELEMENTS = ['pageProgress', 'pageTraitstones', 'pageAchievements']
let activePage = 0
let pseudoKingdomsAreShown = localStorage.getItem(constants.LOCALSTORAGE_SHOW_PSEUDO_KINGDOMS) || 0
let maxPowerKingdomsAreShown = localStorage.getItem(constants.LOCALSTORAGE_SHOW_MAX_POWER_KINGDOMS) || 1
let updateBadgesAreShown = false
let menuIsShown = 0
let anyHelpBoxIsShown = 0
let traitstones = []
let unlimitedTraitstones = [0, 0, 0, 0, 0]
let simulatedTraitstonesOn = 0

// eslint-disable-next-line no-unused-vars
function start(playerData) {
	data = playerData
	readUrlParams()
	if (DEV_FEATURES) console.debug(data)
	let tableProps = tablePropsJs.generateTableProps(data)
	render(tableProps)
	for (let sectionClass in tableProps.sections) {
		tableProps.sections[sectionClass].hidden = 1 - tableProps.sections[sectionClass].hidden
		toggleSection(tableProps.sections[sectionClass], null, tableProps)
	}
	showPage()
	window.onpopstate = updatedBrowserState
}

export default {
	start,
}

// Triggered e.g. when going back in history. Show the page selected via the URL.
function updatedBrowserState() {
	readUrlParams()
	showPage()
}

function render(tableProps) {
	document.getElementById('home').style.display = 'none'
	document.getElementById('pageHeader').style.display = 'inline-block'

	const menuButtonIcon = createIcon('menu', 0)
	menuButtonIcon.id = 'menuButtonIcon'
	const menuButton = document.getElementById('menuButton')
	menuButton.appendChild(menuButtonIcon)
	menuButton.onclick = toggleMenu

	// Menu item actions
	const menuShowUnreachableTasks = document.getElementById('menuShowUnreachableTasks')
	menuShowUnreachableTasks.onclick = function (ev) {
		toggleSection(tableProps.sections.taskUnreachable, ev, tableProps)
	}
	const menuShowPseudoKingdoms = document.getElementById('menuShowPseudoKingdoms')
	menuShowPseudoKingdoms.onclick = togglePseudoKingdoms
	const menuShowMaxPowerKingdoms = document.getElementById('menuShowMaxPowerKingdoms')
	menuShowMaxPowerKingdoms.onclick = function () {
		toggleMaxPowerKingdoms(tableProps)
	}

	const menuQuickHelp = document.getElementById('menuQuickHelp')
	menuQuickHelp.onclick = showQuickHelp

	const menuHelp = document.getElementById('menuHelp')
	menuHelp.onclick = function (ev) {
		showHelp(ev, 0)
	}

	// const menuWhatsNew = document.getElementById("menuWhatsNew");
	// menuWhatsNew.onclick = function(ev) {
	//   if (updateBadgesAreShown) hideUpdateBadges();
	//   showHelp(ev, 1);
	// };
	const menuAbout = document.getElementById('menuAbout')
	menuAbout.onclick = function (ev) {
		showHelp(ev, 2)
	}
	const menuDonate = document.getElementById('menuDonate')
	menuDonate.onclick = showDonate

	// Header bar
	document.getElementById('playerName').textContent = data.name
	document.getElementById('playerLevel').textContent = LABEL_LEVEL + data.level
	document.title = data.name + ' - ' + constants.APP_NAME

	// Pages
	const pageProgress = document.getElementById('pageProgress')
	pageProgress.onclick = function () {
		switchPage(0)
	}
	const pageTraitstones = document.getElementById('pageTraitstones')
	pageTraitstones.onclick = function () {
		switchPage(1)
	}
	const pageAchievements = document.getElementById('pageAchievements')
	pageAchievements.onclick = function () {
		switchPage(2)
	}

	// Main table
	const background = document.getElementById('tableBackground')
	const mainTable = renderMainTable(tableProps)
	background.appendChild(mainTable)

	// Avg tribute
	let avgTribute = document.createElement('div')
	avgTribute.id = 'avgTribute'
	avgTribute.textContent = AVG_TRIBUTE_LABEL + data.avgTribute
	if (DEV_FEATURES) background.appendChild(avgTribute)

	// Traitstones
	const checkboxIncludeMisc = document.getElementById('includeMisc')
	checkboxIncludeMisc.onclick = function () {
		updateTraitstoneTable(tableProps)
	}
	const checkboxIncludeMythics = document.getElementById('includeMythics')
	checkboxIncludeMythics.onclick = function () {
		updateTraitstoneTable(tableProps)
	}
	const checkboxIncludeUnowned = document.getElementById('includeUnowned')
	checkboxIncludeUnowned.onclick = function () {
		updateTraitstoneTable(tableProps)
	}
	const checkboxIncludeUnreleased = document.getElementById('includeUnreleased')
	checkboxIncludeUnreleased.onclick = function () {
		updateTraitstoneTable(tableProps)
	}

	// Table used to hide pseudo-kingdom rows when not shown
	let hiddenTable = document.createElement('table')
	hiddenTable.id = 'hiddenTable'
	hiddenTable.classList.add('hidden')
	hiddenTable.appendChild(document.createElement('tbody'))
	background.appendChild(hiddenTable)

	updatePseudoKingdoms()
	updateMaxPowerKingdoms(tableProps)
	updateTraitstoneTable(tableProps)
	renderAchievementsPage(data.achievements)
	renderQuickTips()

	// Initial hint
	if (localStorage.getItem(constants.LOCALSTORAGE_SEEN_INITIAL_HINT)) {
		document.getElementById('initialHint').style.display = 'none'
		hideQuickHelp()
	} else {
		document.getElementById('initialHint').style.display = 'flex'
		document.onclick = hideInitialHint
	}

	showUpdateBadgesIfNeeded()
}

function showUpdateBadgesIfNeeded() {
	const lastSeenUpdate = localStorage.getItem(constants.LOCALSTORAGE_LAST_SEEN_UPDATE)
	if (lastSeenUpdate < constants.LAST_UPDATE) {
		let badges = [...document.getElementsByClassName('updateBadge')]
		for (let badge of badges) {
			badge.classList.remove('hidden')
		}
		updateBadgesAreShown = true
	}
}

function hideUpdateBadges() {
	let badges = [...document.getElementsByClassName('updateBadge')]
	for (let badge of badges) {
		badge.classList.add('hidden')
	}
	localStorage.setItem(constants.LOCALSTORAGE_LAST_SEEN_UPDATE, Date.now())
	updateBadgesAreShown = false
}

function renderMainTable(tableProps) {
	let mainTable = document.createElement('table')
	mainTable.id = 'mainTable'
	mainTable.classList.add('mainTable')
	renderSectionHeaders(mainTable, tableProps)
	renderHeaders(mainTable, tableProps.columns)
	renderTableContent(mainTable, tableProps)
	mainTable.sorttable_footerrows = 0
	sorttable.makeSortable(mainTable)
	return mainTable
}

function renderQuickTips() {
	const aSectionHeader = [...document.getElementsByClassName('sectionHeaderButtonCell')][2]
	addHelpTooltip(aSectionHeader, 'Expand/collapse sections')
	const aColumnHeader = [...document.getElementsByClassName('columnHeader')][3]
	addHelpTooltip(aColumnHeader, 'Sort by any column')
	const traitstoneSimButton = [...document.getElementsByClassName('simTraitstoneCell')][2]
	addHelpTooltip(traitstoneSimButton, 'Simulate unlimited traitstones')
	const quickPreviewCell = [...document.getElementsByClassName('quickPreviewHover')][4]
	if (quickPreviewCell) {
		quickPreviewCell.style.position = 'relative'
		addHelpTooltip(quickPreviewCell, 'Hover/tap to preview future tasks')
	}
	renderTaskQuickHelp()
}

// Separate method because the tooltip gets removed when swiching traitstones
function renderTaskQuickHelp() {
	// TODO this is unreliable and sometimes gets onder the column headers
	const interestingTooltipCell = [...document.getElementsByClassName('quickHelpCandidate')][2]
	if (interestingTooltipCell && !interestingTooltipCell.querySelector('.helpTooltip')) {
		interestingTooltipCell.style.position = 'relative'
		addHelpTooltip(interestingTooltipCell, 'Hover/tap any "Can" cell to see more details')
	}
}

function renderSectionHeaders(table, tableProps) {
	let thead = document.createElement('thead')
	table.appendChild(thead)
	let tr = document.createElement('tr')
	thead.appendChild(tr)

	let removeNextColumns = 0
	for (let column of tableProps.columns) {
		if (removeNextColumns > 0) {
			removeNextColumns--
			if (column.hidden) {
				let th = document.createElement('th')
				th.classList.add('hidden')
				tr.appendChild(th)
			}
			continue
		}

		let th = document.createElement('th')
		th.classList.add('sectionHeader')
		tr.appendChild(th)

		if (column.colSpan) {
			th.colSpan = column.colSpan
			removeNextColumns = column.colCover ? column.colCover - 1 : column.colSpan - 1
		}
		if (column.simToolbar) {
			th.appendChild(renderSimToolbar(tableProps))
			th.id = 'simToolbarParent'
		}
		if (column.section) {
			const section = column.section
			if (section.checkbox) {
				renderSectionCheckbox(section, th, tableProps)
			} else {
				th.textContent = section.name
				renderSectionExpandButton(th, section, tableProps)
			}
		}

		if (column.classes) th.classList.add(...column.classes)
		if (column.classesOnSectionHeader) th.classList.add(...column.classesOnSectionHeader)
		th.classList.remove('centered')
	}
}

function renderSectionCheckbox(section, th, tableProps) {
	let checkbox = document.createElement('input')
	checkbox.type = 'checkbox'
	checkbox.id = section.checkbox
	checkbox.classList.add('sectionHeaderCheckbox')
	if (!section.hidden) checkbox.checked = true
	th.appendChild(checkbox)
	let label = document.createElement('div')
	label.for = checkbox.id
	label.textContent = section.checkboxLabel
	label.classList.add('sectionHeaderCheckboxLabel')
	th.appendChild(label)
	th.classList.add('sectionHeaderCheckboxParent')
	checkbox.onclick = function (ev) {
		toggleSection(section, ev, tableProps)
	}
	label.onclick = function (ev) {
		toggleSection(section, ev, tableProps)
	}
}

function renderSectionExpandButton(th, section, tableProps) {
	let button = document.createElement('span')
	button.innerHTML = section.hidden ? '&raquo;' : '&laquo;'
	button.classList.add('topicExpandButton')
	th.appendChild(button)
	th.classList.add('sectionHeaderButtonCell')
	th.onclick = function (ev) {
		th.childNodes[1].innerHTML = toggleSection(section, ev, tableProps) ? '&raquo;' : '&laquo;'
	}
}

function renderSimToolbar(tableProps) {
	const tsSimTable = document.createElement('div')
	tsSimTable.id = 'simTable'
	for (let [i, group] of constants.TRAITSTONE_GROUPS.entries()) {
		const td = document.createElement('div')
		td.classList.add('simTraitstoneCell')
		tsSimTable.appendChild(td)
		let pic = createIcon('traitstones/' + group[2] + '_small', 0)
		pic.title = group[0]
		pic.index = i
		pic.onclick = function () {
			switchTraitstones(this.index, tableProps)
		}
		pic.classList.add('simTraitstone')
		if (i == 4) pic.classList.add('simTraitstoneColorful')
		td.appendChild(pic)
		pic = createIcon('infinity', 0)
		pic.classList.add('simTraitstoneSymbol', 'hidden')
		td.appendChild(pic)
	}
	return tsSimTable
}

function renderHeaders(table, columns) {
	let thead = table.tHead
	let tr = document.createElement('tr')
	thead.appendChild(tr)
	for (let column of columns) {
		if (column.hidden) continue
		let th = document.createElement('th')
		th.textContent = column.name
		th.classList.add('columnHeader')
		if (column.taskUnreachableDependent) th.classList.add('quickPreviewTaskUnreachableDependent')
		tr.appendChild(th)
		if (column.icon) th.appendChild(createIcon(column.icon, 2))
		if (column.classes) th.classList.add(...column.classes)
		if (column.classesOnHeader) th.classList.add(...column.classesOnHeader)
	}
}

function renderTableContent(table, tableProps) {
	const tbody = document.createElement('tbody')
	table.appendChild(tbody)
	for (let kingdom of tableProps.renderedKingdoms) {
		// if (DEV_FEATURES) console.debug("Rendering " + kingdom.name + "(" + kingdom.id + ")");
		const tr = tbody.insertRow(-1)
		tr.id = 'row-' + kingdom.id

		// Kingdom name cell
		const th = document.createElement('th')
		th.scope = 'row'
		th.classList.add(...tableProps.columns[0].classes)
		let crestId = kingdom.fileId
		if (crestId.length < 2) crestId = '0' + crestId
		const imgBox = document.createElement('div')
		imgBox.classList.add('boxedIcon')
		imgBox.appendChild(createIcon('crests/' + crestId, 3))
		th.appendChild(imgBox)
		th.appendChild(createGowDBLink('kingdoms', kingdom.id, kingdom.name))
		if (!kingdom.isTrueKingdom) tr.classList.add(CLASS_PSEUDO_KINGDOM)
		tr.appendChild(th)

		renderRow(tr, kingdom, tableProps)
		renderTasks(tr, kingdom, tableProps)
	}
	return table
}

function renderRow(tr, kingdom, tableProps) {
	let factionPetUnreleased = 0

	// Iterate all columns except "name" and task ones
	for (let column of tableProps.columns.filter(x => x.attribute && x.attribute != 'name')) {
		let attribute = column.attribute

		// Create the cell
		const td = tr.insertCell(-1)
		if (column.maxValue) td.maxValue = column.maxValue
		if (column.classes) td.classList.add(...column.classes)
		if (column.classesOnCells) td.classList.add(...column.classesOnCells)
		if (!kingdom.isTrueKingdom) tr.classList.add(CLASS_PSEUDO_KINGDOM)

		// Render cell content
		if (!column.calculated && kingdom[attribute] === undefined) continue // Skip empty values
		td.textContent = kingdom[attribute]

		// Calculated / complex cell values
		// Kingdom -------------------------------------------------------------------------------------------------
		if (attribute == 'levelStat') {
			td.textContent = ''
			td.appendChild(createIcon(kingdom[attribute], 2))
			td.setAttribute('sorttable_customkey', kingdom[attribute])
		} else if (attribute == 'powerLevel') {
			if (kingdom.maxReachablePowerLevel > kingdom.powerLevel) {
				td.innerHTML = SPAN_UPGRADE_DUMMY + "<span class='upgradeText'>" + td.innerHTML + '</span>' + SPAN_UPGRADE
				td.childNodes[2].appendChild(createIcon('upgrade', 2))
				addSimpleTooltip(td, TOOLTIP_UPGRADE.replace('$p', kingdom.maxReachablePowerLevel))
			}
			td.maxValue = kingdom.maxPowerLevel
			td.setAttribute('sorttable_customkey', kingdom[attribute])
		} else if (attribute == 'maxPowerLevel') {
			if (kingdom.futurePowers.length > 0) {
				let tooltipContent = ''
				td.innerHTML =
					SPAN_FUTURE_POWER_DUMMY + "<span class='upgradeText'>" + td.innerHTML + '</span>' + SPAN_FUTURE_POWER
				for (let futurePower of kingdom.futurePowers) {
					if (tooltipContent.length > 0) tooltipContent += '<br>'
					tooltipContent += TOOLTIP_FUTURE_POWER_LEVELS.replace('$p', futurePower.power).replace(
						'$d',
						formatDate(futurePower.date)
					)
				}
				addSimpleTooltip(td, tooltipContent)
			}
			td.setAttribute('sorttable_customkey', kingdom[attribute])
		} else if (attribute == 'deedColor') {
			td.textContent = ''
			td.appendChild(createIcon(MANA_ICONS[kingdom.deedColor], 2))
			td.setAttribute('sorttable_customkey', kingdom[attribute])
			addSimpleTooltip(td, kingdom.deedName)
		} else if (attribute == 'traitstone') {
			td.appendChild(createIcon('traitstones/' + kingdom.traitstone + '_small', 3))
			td.setAttribute('sorttable_customkey', kingdom[attribute])
			addSimpleTooltip(td, kingdom.traitstoneName)
		} else if (attribute == 'ownedTroops') {
			renderOwnedItemsCell(kingdom.troops, td, false, constants.TASK_KIND_TROOPS, tableProps, null)
		} else if (attribute == 'ownedTroopsAtLevel20') {
			renderUpgradedTroopsCell(
				kingdom.troops,
				td,
				[
					{
						condition: x => x.level == 20,
						label: 'At level 20',
					},
					{
						// copiesNeeded is correct for target level 20 here
						// because the last task we analyze is always a "level x troops to 20" one.
						// This is actually pretty ugly..
						condition: x => x.level < 20 && x.copiesNeeded <= 0,
						label: 'Not at level 20, upgradeable',
					},
					{
						condition: x => x.copiesNeeded > 0 && x.kingdoms.length > 1,
						label: 'Copies missing (faction)',
						showCopiesMissing: true,
					},
					{
						condition: x => x.copiesNeeded > 0 && x.kingdoms.length == 1,
						label: 'Copies missing',
						showCopiesMissing: true,
					},
				],
				'Others(?)'
			)
		} else if (attribute == 'ownedTroopsTraited') {
			renderUpgradedTroopsCell(
				kingdom.troops,
				td,
				[
					{
						condition: x => x.traitCount == 3,
						label: 'Fully traited',
					},
				],
				'Owned, not fully traited'
			)
		} else if (attribute == 'ownedTroopsMedaledNone') {
			renderUpgradedTroopsCell(
				kingdom.troops,
				td,
				[
					{
						condition: x => x.eliteLevel == 0,
						label: 'No medal',
					},
				],
				null
			)
		} else if (attribute == 'ownedTroopsMedaledBronze') {
			renderUpgradedTroopsCell(
				kingdom.troops,
				td,
				[
					{
						condition: x => x.eliteLevel == 1,
						label: 'Bronze medal',
					},
				],
				null
			)
		} else if (attribute == 'ownedTroopsMedaledSilver') {
			renderUpgradedTroopsCell(
				kingdom.troops,
				td,
				[
					{
						condition: x => x.eliteLevel == 2,
						label: 'Silver medal',
					},
				],
				null
			)
		} else if (attribute == 'ownedTroopsMedaledGold') {
			renderUpgradedTroopsCell(
				kingdom.troops,
				td,
				[
					{
						condition: x => x.eliteLevel == 3,
						label: 'Gold medal',
					},
				],
				null
			)
		} else if (attribute == 'ownedWeapons') {
			renderOwnedItemsCell(kingdom.weapons, td, true, constants.TASK_KIND_WEAPONS, tableProps, kingdom.weaponsOwned)
		} else if (attribute == 'ownedPets') {
			renderOwnedItemsCell(kingdom.pets, td, false, constants.TASK_KIND_PETS, tableProps, null)

			// Faction -------------------------------------------------------------------------------------------------
		} else if (attribute == 'faction') {
			td.textContent = ''
			if (kingdom.faction) {
				td.appendChild(createGowDBLink('kingdoms', kingdom.faction, data.kingdoms[kingdom.faction].name))
			}
		} else if (attribute == 'factionColors') {
			td.textContent = ''
			if (kingdom.factionColor1) {
				td.appendChild(createIcon(MANA_ICONS[kingdom.factionColor1 - 1], 2))
				td.appendChild(createIcon(MANA_ICONS[kingdom.factionColor2 - 1], 2))
				td.setAttribute('sorttable_customkey', String(kingdom.factionColor1) + kingdom.factionColor2)
			}
		} else if (attribute == 'factionWeapon') {
			renderWeaponCell(td, kingdom.factionWeapon, tableProps)
		} else if (
			(attribute == 'hoardLevel' && kingdom.renown < 2500) ||
			(attribute == 'hoardQuality' && kingdom.hoardQuality < 10)
		) {
			addSimpleTooltip(td, TOOLTIP_HOARD_MASTER)
		} else if (attribute == 'factionTroops') {
			if (kingdom.faction) {
				renderOwnedItemsCell(
					data.kingdoms[kingdom.faction].troops,
					td,
					false,
					constants.TASK_KIND_TROOPS,
					tableProps,
					null
				)
			}

			// Class -------------------------------------------------------------------------------------------------
		} else if (attribute == 'class') {
			td.textContent = ''
			td.appendChild(createGowDBLink('classes', kingdom.classWeapon + 10000, kingdom.class.name))
		} else if (attribute == 'championLevel') {
			if (kingdom.classMilestone > kingdom.classTraitsAssigned) {
				td.innerHTML += '&nbsp;<span style="color: var(--color-warning)">*</span>'
				addSimpleTooltip(td, TOOLTIP_UNASSIGNED_TALENTS)
			}
		} else if (attribute == 'xp') {
			if (kingdom.championLevel == 100 || !kingdom.championLevel) {
				td.textContent = ''
			} else {
				let xp = Math.min(5050, kingdom.championXP) - kingdom.championLevel * (kingdom.championLevel / 2 + 0.5)
				td.textContent = xp + '/' + (kingdom.championLevel + 1)
				td.setAttribute('sorttable_customkey', xp)
			}
		} else if (attribute == 'classWeapon') {
			renderWeaponCell(td, kingdom.classWeapon, tableProps)
		} else if (attribute == 'class_storms') {
			td.textContent = ''
			let sortKey = ''
			for (let storm of kingdom.class_permastorms) {
				td.appendChild(createIcon(MANA_ICONS[storm], 2))
				td.appendChild(createIcon(MANA_ICONS[storm], 2, 'shiftedIcon'))
			}
			if (kingdom.class_permastorms.length > 0) td.innerHTML += '('
			for (let storm of kingdom.class_storms) {
				td.appendChild(createIcon(MANA_ICONS[storm], 2))
				sortKey += String.fromCharCode(94 + storm)
			}
			if (kingdom.class_permastorms.length > 0) td.innerHTML += ')'
			td.setAttribute('sorttable_customkey', sortKey)
		} else if (attribute == 'class_bonusMana') {
			td.textContent = ''
			let sortKey = ''
			for (let bonus of kingdom.class_permaBonusMana) {
				td.appendChild(createIcon(MANA_ICONS[bonus], 2))
				sortKey += String.fromCharCode(94 + bonus)
			}
			if (kingdom.class_permaBonusMana.length > 0) td.innerHTML += '+'
			for (let [j, bonus] of kingdom[attribute].entries()) {
				if (j > 0) td.innerHTML += '/'
				td.appendChild(createIcon(MANA_ICONS[bonus], 2))
				sortKey += String.fromCharCode(94 + bonus)
			}
			td.setAttribute('sorttable_customkey', sortKey)
		} else if (attribute.includes('class_')) {
			if (td.textContent == 'x') td.innerHTML = SPAN_CHECK

			// Pets -------------------------------------------------------------------------------------------------
		} else if (attribute.includes('petName')) {
			let petNumber = Number(attribute.slice(7))
			let pet = kingdom.pets[petNumber - factionPetUnreleased]
			if (pet) {
				if (petNumber == 0 && pet.type != 1) {
					// Skip cell for unreleased faction pet
					factionPetUnreleased = 1
				} else {
					let petNameDiv = document.createElement('div')
					petNameDiv.textContent = pet.name
					petNameDiv.classList.add('petText')
					td.appendChild(petNameDiv)
					// Add the progress bar
					let bar = document.createElement('div')
					bar.classList.add('petBar', pet.totalCount < 31 ? 'petBarIncomplete' : 'petBarComplete')
					bar.style.width = (pet.totalCount >= 31 ? 100 : (pet.totalCount / 31) * 100) + '%'
					td.appendChild(bar)
					// Mark cosmetic pets
					if (pet.type == 4) {
						petNameDiv.classList.add('petTextCosmetic')
						addSimpleTooltip(td, pet.totalCount + '&nbsp;/&nbsp;31' + '<br>' + TOOLTIP_COSMETIC_PET)
					} else if (pet.totalCount < 31) addSimpleTooltip(td, pet.totalCount + '&nbsp;/&nbsp;31')
				}
			}
		} else if (attribute.includes('petCount')) {
			let petNumber = Number(attribute.slice(7))
			let pet = kingdom.pets[petNumber - factionPetUnreleased]
			if (pet) {
				if (petNumber == 0 && pet.type != 1) {
					// Skip cell for unreleased faction pet
				} else {
					td.textContent = pet.totalCount
				}
			}

			// Shiny troops -------------------------------------------------------------------------------------------------
		} else if (attribute.includes('shinyName')) {
			let shinyTroopNumber = Number(attribute.slice(9))
			let troop = kingdom.shinyTroops[shinyTroopNumber]
			if (troop) {
				var shinyLevel = troop.shinyLevel != undefined ? troop.shinyLevel : 0
				let shinyTroopNameDiv = document.createElement('div')
				shinyTroopNameDiv.textContent = troop.name
				shinyTroopNameDiv.classList.add('shinyTroopText')
				td.appendChild(shinyTroopNameDiv)
				// Add the progress bar
				let bar = document.createElement('div')
				bar.classList.add(
					'shinyTroopBar',
					shinyLevel < 5 + 10 + 20 ? 'shinyTroopBarIncomplete' : 'shinyTroopBarComplete'
				)
				bar.style.width = (shinyLevel >= 5 + 10 + 20 ? 100 : (shinyLevel / (5 + 10 + 20)) * 100) + '%'
				td.appendChild(bar)
				if (shinyLevel < 5 + 10 + 20) addSimpleTooltip(td, shinyLevel + '/' + (5 + 10 + 20))
			}
		} else if (attribute.includes('shinyLevel')) {
			let shinyTroopNumber = Number(attribute.slice(9))
			let troop = kingdom.shinyTroops[shinyTroopNumber]
			if (troop) {
				td.textContent = troop.shinyLevel != undefined ? troop.shinyLevel : 0
			}
		}

		if (maxValueReached(td)) td.classList.add('maxValueReached')
	}
}

function renderWeaponCell(td, weaponId, tableProps) {
	td.textContent = ''
	if (!weaponId) return
	if (data.weapons[weaponId].count) {
		td.innerHTML = SPAN_CHECK
	} else if (tableProps.haveFullData) {
		td.innerHTML = SPAN_UNCHECK
	} else {
		td.innerHTML = SPAN_UNKNOWN
		const tooltipSpan = document.createElement('span')
		addWarningToTooltip(tooltipSpan, TOOLTIP_NO_WEAPON_DATA)
		assignTooltip(td, tooltipSpan)
	}
	td.appendChild(createGowDBLink('weapons', weaponId, data.weapons[weaponId].name))
}

function renderOwnedItemsCell(items, td, countNeedsFullData, kind, tableProps, countOverride) {
	let numTotalItems = items.length
	const ownedItemList = sortItemList(items.filter(x => x.count))
	const numOwnedItems = countOverride === null ? ownedItemList.length : countOverride
	let showOwnedItems = numOwnedItems
	const missingData =
		numTotalItems > 0 && countOverride === null && numOwnedItems == 0 && countNeedsFullData && !tableProps.haveFullData
	if (missingData) showOwnedItems = '?'

	const potentiallyIncompleteData =
		numOwnedItems > 0 && numOwnedItems < numTotalItems && countNeedsFullData && !tableProps.haveFullData
	if (potentiallyIncompleteData && countOverride === null) showOwnedItems += '+'
	td.textContent = showOwnedItems + ' / ' + numTotalItems
	td.maxValue = numTotalItems
	td.setAttribute('sorttable_customkey', numOwnedItems)
	const tooltipSpan = document.createElement('span')
	tooltipSpan.classList.add('tooltipShiftedLeft')
	if (ownedItemList.length > 0) {
		let ownedItemsLabel = potentiallyIncompleteData ? 'Definitely owned:' : 'Owned:'
		addTroopsToTooltip(tooltipSpan, { kind }, ownedItemsLabel, ownedItemList, ownedItemList, false, false, false)
	}
	if (numOwnedItems < numTotalItems) {
		let missingItemsLabel = potentiallyIncompleteData ? 'May be missing:' : TOOLTIP_MISSING
		let unownedItemList = sortItemList(items.filter(x => !x.count))
		addTroopsToTooltip(tooltipSpan, { kind }, missingItemsLabel, unownedItemList, unownedItemList, false, false, false)
	}
	if (missingData || potentiallyIncompleteData) {
		addWarningToTooltip(tooltipSpan, TOOLTIP_NO_WEAPON_DATA)
	}
	assignTooltip(td, tooltipSpan)
}

function renderUpgradedTroopsCell(troops, td, upgrades, labelNotUpgraded) {
	const separators = [' ( ', ' | ', ' | ', ' )']
	let troopLists = []
	let unupgradedTroopList = sortItemList(troops.filter(x => x.count))
	const tooltipSpan = document.createElement('span')
	for (let upgrade of upgrades) {
		let troopList = sortItemList(troops.filter(upgrade.condition))
		troopLists.push(troopList)
		unupgradedTroopList = unupgradedTroopList.filter(x => !upgrade.condition(x))
		td.textContent += troopList.length
		if (troops.length == troopLists[0].length) break // Stop if all troops are upgraded
		if (upgrades.length > 1 && td.textContent) td.textContent += separators[troopLists.length - 1]
		if (troopList.length > 0) {
			addTroopsToTooltip(
				tooltipSpan,
				{ kind: constants.TASK_KIND_TROOPS },
				upgrade.label + ':',
				troopList,
				troopList,
				false,
				upgrade.showCopiesMissing,
				false
			)
		}
	}
	td.setAttribute('sorttable_customkey', troopLists[0].length)
	td.maxValue = troops.length
	if (labelNotUpgraded && unupgradedTroopList.length > 0) {
		addTroopsToTooltip(
			tooltipSpan,
			{ kind: constants.TASK_KIND_TROOPS },
			labelNotUpgraded + ':',
			unupgradedTroopList,
			unupgradedTroopList,
			false,
			false,
			false
		)
	}
	tooltipSpan.classList.add('tooltipShiftedLeft')
	assignTooltip(td, tooltipSpan)
}

function sortItemList(itemList) {
	return itemList.sort(common.sortFn('name')).sort(common.sortFn('baseRarity')).sort(common.sortFn('type'))
}

function maxValueReached(cell) {
	if (cell.childNodes[0] && cell.childNodes[0].nodeType === Node.TEXT_NODE) {
		let value = Number(cell.childNodes[0].nodeValue.split(/\||\/|-/)[0])
		return value >= cell.maxValue
	}
	return false
}

function renderTasks(tr, kingdom, tableProps) {
	// Empty cells for non-kingdoms
	if (!kingdom.isTrueKingdom) {
		for (let columnNumber = 0; columnNumber < 9; columnNumber++) {
			createTaskCell(tr, tableProps.taskColumns[columnNumber], false, {})
		}
		createTaskCell(tr, tableProps.quickPreviewColumn, false, {})
		return
	}

	// Current tasks
	for (let [taskNumber, task] of kingdom.tasks.entries()) {
		let columnNumber = taskNumber * 3
		renderTask(tr, task, false, tableProps.taskColumns, columnNumber)
	}

	// Quick preview
	renderQuickPreviewCell(tr, tableProps.quickPreviewColumn, kingdom, tableProps)

	// Previews
	let columnNumber = 1
	for (let [taskNumber, task] of kingdom.previewTasks.flat(1).entries()) {
		if (taskNumber % 3 == 0) {
			createPowerLevelCell(tr, tableProps.previewColumns[columnNumber], task, false)
			columnNumber++
		}
		renderTask(tr, task, false, tableProps.previewColumns, columnNumber)
		columnNumber += 3
	}
}

function renderTask(tr, task, renderingQuickPreview, taskColumns, columnNumber) {
	renderDescCell(task, createTaskCell(tr, taskColumns[columnNumber], renderingQuickPreview, task))
	renderNeedCell(task, createTaskCell(tr, taskColumns[columnNumber + 1], renderingQuickPreview, task))
	renderCanCell(task, createTaskCell(tr, taskColumns[columnNumber + 2], renderingQuickPreview, task))
}

function renderQuickPreviewCell(tr, column, kingdom, tableProps) {
	let quickPreviewCell = createTaskCell(tr, column, false, {})
	quickPreviewCell.appendChild(createIcon('binoculars', 1))

	const quickPreviewTooltipSpan = document.createElement('span')
	const titleDiv = document.createElement('div')
	titleDiv.textContent = 'Task preview for ' + kingdom.name
	titleDiv.classList.add('tooltipHeader')
	quickPreviewTooltipSpan.appendChild(titleDiv)
	quickPreviewTooltipSpan.appendChild(renderQuickPreview(kingdom, tableProps.quickPreviewColumns))
	assignTooltip(quickPreviewCell, quickPreviewTooltipSpan)
}

function renderQuickPreview(kingdom, quickPreviewColumns) {
	// Check if we should hide some columns
	for (let c of [2, 3, 5, 6, 8, 9]) {
		quickPreviewColumns[c].hidden = true
		quickPreviewColumns[c].taskUnreachableDependent = false
	}
	for (let task of [...kingdom.tasks, ...kingdom.previewTasks.flat(1)]) {
		if (!task.completed) {
			if (task.unreachable && quickPreviewColumns[task.column * 3].hidden) {
				quickPreviewColumns[task.column * 3 - 1].taskUnreachableDependent = true
				quickPreviewColumns[task.column * 3].taskUnreachableDependent = true
			}
			quickPreviewColumns[task.column * 3 - 1].hidden = false
			quickPreviewColumns[task.column * 3].hidden = false
		}
	}

	let quickPreviewTable = document.createElement('table')
	quickPreviewTable.id = 'quickPreviewTable-' + kingdom.id
	quickPreviewTable.classList.add('quickPreviewTable')
	let thead = document.createElement('thead')
	quickPreviewTable.appendChild(thead)
	renderHeaders(quickPreviewTable, quickPreviewColumns)
	const tbody = document.createElement('tbody')
	quickPreviewTable.appendChild(tbody)

	let tr
	for (let [taskNumber, task] of [...kingdom.tasks, ...kingdom.previewTasks.flat(1)].entries()) {
		let columnNumber = (taskNumber % 3) * 3
		if (columnNumber == 0) {
			tr = tbody.insertRow(-1)
			createPowerLevelCell(tr, quickPreviewColumns[columnNumber], task, true)
		}
		renderTask(tr, task, true, quickPreviewColumns, columnNumber + 1)
	}
	return quickPreviewTable
}

function createPowerLevelCell(tr, column, firstTask, renderingQuickPreview) {
	let powerLevelCell = createTaskCell(tr, column, renderingQuickPreview, firstTask)
	powerLevelCell.textContent = firstTask.targetPowerLevel
}

function createTaskCell(tr, column, renderingQuickPreview, task) {
	let cell = tr.insertCell(-1)

	if (column.hidden) {
		cell.classList.add('hidden')
		return cell
	}

	let cellClasses = []
	if (renderingQuickPreview) {
		if (task.isPreview) {
			cellClasses.push('quickPreview')
		} else {
			cellClasses.push('quickPreviewTask')
		}
		if (column.taskUnreachableDependent) cellClasses.push('quickPreviewTaskUnreachableDependent')
	}
	if (task.unreachable) {
		const unreachableClass = renderingQuickPreview ? 'quickPreviewTaskUnreachable' : 'taskUnreachable'
		cellClasses.push(unreachableClass)
	}
	if (column.classes) cell.classList.add(...column.classes)
	if (column.classesOnCells) cell.classList.add(...column.classesOnCells)
	cell.classList.add(...cellClasses)
	return cell
}

function renderDescCell(task, cell) {
	cell.textContent = shortenTaskLabel(
		task.desc,
		data.kingdoms[task.kingdomId].name,
		data.kingdoms[task.kingdomId].class.name
	)
	if (task.completed) {
		cell.classList.add('taskCompleted')
	} else if (task.completable) {
		cell.classList.add('taskCompletable')
	}
	if (task.locked) cell.classList.add('taskIncompletable')
	if (!task.completed && task.unknownCan) {
		cell.classList.add('taskUnknown')
	}
}

function renderNeedCell(task, cell) {
	if (task.completed) return

	if (!task.completed && task.unknownCan) cell.classList.add('taskUnknown')
	if (task.isPreview && task.unknownValue) {
		if (task.value) {
			cell.textContent = task.targetValue - task.value + '-'
		} else {
			cell.textContent = '?'
		}
		const tooltipSpan = document.createElement('span')
		addWarningToTooltip(tooltipSpan, TOOLTIP_NO_WEAPON_DATA)
		assignTooltip(cell, tooltipSpan)
	} else if (task.isSupported && !task.unevaluated) {
		cell.textContent = task.targetValue - task.value
	}
	if (task.tooltipValue) {
		addSimpleTooltip(cell, task.tooltipValue)
	}
	if (task.completable) cell.classList.add('taskCompletable')
	if (task.locked) cell.remove()
}

function renderCanCell(task, cell) {
	if (task.completed) return

	if (task.isSupported) {
		cell.textContent = ''
		cell.appendChild(makeSpan(task.canValue))
		cell.setAttribute('sorttable_customkey', task.canValue)
	}

	const tooltipSpan = document.createElement('span')
	let tooltipHeader
	cell.classList.remove(
		'taskUnknown',
		'taskIncompletable',
		'taskCompletable',
		'taskCompletableWithSouls',
		'taskCompletableWithShards',
		'taskCompletableInSim',
		'taskImprovedInSim'
	)

	if (task.locked) {
		cell.textContent = ''
		cell.appendChild(createIcon('lock', 1))
		cell.classList.add('taskIncompletable')
		tooltipSpan.textContent = TOOLTIP_TASK_LOCKED
		cell.colSpan = 2
		cell.setAttribute('sorttable_customkey', 999999)
		if (task.unlocksOn) {
			const dateString = formatDate(task.unlocksOn)
			cell.appendChild(makeSpan('(' + dateString + ')'))
			tooltipSpan.textContent = TOOLTIP_TASK_UNLOCKED_ON + dateString
		}
	} else if (task.unknownCan) {
		cell.classList.add('taskUnknown')
		if (task.canValue) {
			if (task.type == constants.TASK_TYPE_UPGRADE_WEAPONS) {
				cell.textContent = task.canValue + (task.value + task.canValue < task.maxValue ? '+' : '')
				if (task.completable) cell.classList.add('taskCompletableWithSouls')
				if (task.troopList && task.troopList.length > 0) {
					addTroopsToTooltip(tooltipSpan, task, TOOLTIP_CANDIDATES_AT_LEAST, task.troopList, null, false, false, false)
				}
			} else {
				cell.textContent = task.canValue + '-'
			}
		} else {
			cell.textContent = '?'
		}
		addWarningToTooltip(tooltipSpan, TOOLTIP_NO_WEAPON_DATA)
	} else {
		switch (task.type) {
			case constants.TASK_TYPE_TRAIT_TROOPS:
				if (!task.isPreview && !task.locked) cell.classList.add('quickHelpCandidate')
			case constants.TASK_TYPE_TRAIT_CLASS:
				tooltipHeader = TOOLTIP_HEADER_TRAITABLE
				if (simulatedTraitstonesOn) {
					cell.textContent = task.simCanValue
					if (task.simCanValue > task.canValue) {
						cell.classList.add('taskImprovedInSim')
					}
				}
				if (task.completable) {
					cell.classList.add('taskCompletable')
				} else if (task.completableInSimulation) {
					cell.classList.add('taskCompletableInSim')
				}
				// TODO add marker if there are enough stones as well as shards? checking for stones might be cumbersome
				// else if (task.missingFactionTroops >= task.targetValue - task.canValue - task.value) {
				//   cell.classList.add("taskCompletableWithShards");
				// }
				break
			case constants.TASK_TYPE_LEVEL_TROOPS:
				if (!task.isPreview && !task.locked) cell.classList.add('quickHelpCandidate')
			case constants.TASK_TYPE_LEVEL_CLASS:
				tooltipHeader = TOOLTIP_HEADER_UPGRADEABLE
				if (task.canValue > 50) {
					cell.appendChild(createIcon('souls', 1, 'padBottom'))
					cell.classList.add('taskCompletableWithSouls')
				} else if (task.missingFactionTroops >= task.targetValue - task.canValue - task.value) {
					cell.classList.add('taskCompletableWithShards')
				}
				break

			case constants.TASK_TYPE_MEDAL_TROOPS:
			case constants.TASK_TYPE_UPGRADE_WEAPONS:
				tooltipHeader = TOOLTIP_CANDIDATES
				break
			case constants.TASK_TYPE_COLLECT_TROOPS:
			case constants.TASK_TYPE_COLLECT_TROOPS_OF_RARITY:
			case constants.TASK_TYPE_COLLECT_WEAPONS:
			case constants.TASK_TYPE_COLLECT_PETS:
				tooltipHeader = TOOLTIP_MISSING
				break
			case constants.TASK_TYPE_LEVEL_PETS:
				tooltipHeader = TOOLTIP_MISSING_COPIES
				if (task.completable) {
					cell.classList.add('taskCompletable')
				}
				break
		}

		// trait c/t, level c/t/p, collect t/w/p, upgrade w, medal t
		if (
			(task.troopList && task.troopList.length > 0) ||
			(simulatedTraitstonesOn && task.type == constants.TASK_TYPE_TRAIT_TROOPS && task.troopListInSim.length > 0)
		) {
			addTroopsToTooltip(
				tooltipSpan,
				task,
				tooltipHeader,
				task.troopList,
				task.troopListInSim,
				false,
				task.type == constants.TASK_TYPE_LEVEL_PETS,
				false
			)
		}
		// trait t
		if (task.nextTraitableTroops && task.nextTraitableTroops.length > 0) {
			addTroopsToTooltip(
				tooltipSpan,
				task,
				TOOLTIP_CANDIDATES,
				task.nextTraitableTroops.slice(0, TOOLTIP_MAX_CANDIDATE_TROOPS),
				null,
				true,
				false,
				false
			)
		}
		// level t, trait t
		if (task.missingFactionTroops) {
			const header =
				task.type == constants.TASK_TYPE_LEVEL_TROOPS ? TOOLTIP_FACTION_TROOPS_RARITY : TOOLTIP_FACTION_TROOPS_MISSING
			addTroopsToTooltip(
				tooltipSpan,
				task,
				header,
				task.missingFactionTroopList,
				null,
				false,
				false,
				task.type == constants.TASK_TYPE_LEVEL_TROOPS
			)
		}
		// trait t
		if (task.type == constants.TASK_TYPE_TRAIT_TROOPS) {
			let unownedItemList = sortItemList(
				data.kingdoms[task.kingdomId].troops.filter(x => x.kingdoms.length == 1 && !x.count)
			)
			if (unownedItemList.length > 0) {
				addTroopsToTooltip(
					tooltipSpan,
					{ kind: constants.TASK_KIND_TROOPS },
					'Missing regular troops:',
					unownedItemList,
					unownedItemList,
					false,
					false,
					false
				)
			}
		}
		// level t
		if (task.unlevelableTroops && task.unlevelableTroops.length > 0) {
			addTroopsToTooltip(
				tooltipSpan,
				task,
				TOOLTIP_FEWEST_MISSING_COPIES,
				task.unlevelableTroops.slice(0, TOOLTIP_MAX_TROOPS_WITH_COPIES_NEEDED),
				null,
				false,
				true,
				false
			)
		}
	}

	assignTooltip(cell, tooltipSpan)
}

function addTroopsToTooltip(
	tooltipSpan,
	task,
	tooltipHeader,
	troopList,
	troopListInSim,
	showTraitstones,
	showCopiesNeeded,
	showShardCost
) {
	const sectionDiv = document.createElement('div')
	sectionDiv.classList.add('tooltipSection')

	const titleDiv = document.createElement('div')
	titleDiv.textContent = tooltipHeader
	titleDiv.classList.add('tooltipHeader')

	if (tooltipSpan.textContent || tooltipSpan.hasChildNodes()) {
		tooltipSpan.style['column-count'] = 2
	}
	tooltipSpan.appendChild(sectionDiv)
	sectionDiv.appendChild(titleDiv)

	for (let troop of simulatedTraitstonesOn && troopListInSim ? troopListInSim : troopList) {
		const troopDiv = document.createElement('div')
		troopDiv.classList.add('tooltipRow')
		if (simulatedTraitstonesOn && !troopList.includes(troop)) {
			troopDiv.classList.add('taskCompletableInSim')
		}
		const troopNameDiv = document.createElement('div')
		if (task.kind == constants.TASK_KIND_TROOPS || task.kind == constants.TASK_KIND_WEAPONS) {
			troopNameDiv.textContent = RARITY_LABELS[troop.baseRarity] + ' '
			troopNameDiv.classList.add('tooltipCell', 'troopRarity' + (troop.isBoss ? '7' : troop.baseRarity))
		} else if (task.kind == constants.TASK_KIND_PETS) {
			troopNameDiv.classList.add('tooltipCell', 'petType' + troop.type)
		}
		troopNameDiv.textContent += troop.name
		if (troop.inSoulforge) troopNameDiv.appendChild(createIcon('anvil', 1))
		if (troop.kingdoms?.length > 1 && !showShardCost) {
			troopNameDiv.innerHTML += '&nbsp;'
			troopNameDiv.appendChild(createIcon('shard', 1))
		}
		troopDiv.appendChild(troopNameDiv)
		if (showTraitstones && troop.missingStoneValue) {
			troopNameDiv.innerHTML += '&nbsp;&nbsp;'
			for (let [i, count] of troop.missingStones.entries()) {
				if (count <= 0) continue
				const traitstoneDiv = document.createElement('div')
				traitstoneDiv.classList.add('tooltipCell')
				const traitstoneInnerDiv = document.createElement('div')
				traitstoneInnerDiv.appendChild(createIcon('traitstones/' + (i < 10 ? '0' : '') + i + '_small', 4))
				traitstoneInnerDiv.innerHTML += '&nbsp;' + count + '&nbsp;&nbsp;'
				traitstoneInnerDiv.classList.add('tooltipCellInner')
				traitstoneDiv.appendChild(traitstoneInnerDiv)
				troopDiv.appendChild(traitstoneDiv)
			}
		} else if (task.kind != constants.TASK_KIND_PETS && (showCopiesNeeded || showShardCost)) {
			troopNameDiv.innerHTML += '&nbsp;&nbsp;'
			const copiesDiv = document.createElement('div')
			copiesDiv.classList.add('tooltipCell', 'numeric')
			copiesDiv.innerHTML +=
				'&nbsp;' + (showCopiesNeeded ? troop.copiesNeeded : '~' + troop.expectedShardCost) + '&nbsp;'
			if (showShardCost) copiesDiv.appendChild(createIcon('shard', 1))
			if (troop.ascendable) {
				copiesDiv.textContent = TOOLTIP_TROOP_ASCENDABLE
				copiesDiv.classList.add('maxValueReached')
			}
			troopDiv.appendChild(copiesDiv)
		} else if (task.kind == constants.TASK_KIND_PETS) {
			if (troop.type != 2) troopNameDiv.innerHTML += ' (' + constants.PET_TYPES[troop.type] + ')'
			troopNameDiv.innerHTML += '&nbsp;&nbsp;'
			if (showCopiesNeeded) {
				const copiesDiv = document.createElement('div')
				copiesDiv.innerHTML += troop.copiesNeeded > 31 ? '?' : troop.copiesNeeded
				copiesDiv.classList.add('tooltipCell', 'numeric')
				if (troop.ascendable) {
					copiesDiv.textContent = TOOLTIP_TROOP_ASCENDABLE
					copiesDiv.classList.add('maxValueReached')
				}
				troopDiv.appendChild(copiesDiv)
			}
		}
		sectionDiv.appendChild(troopDiv)
	}
}

function assignTooltip(element, tooltipSpan) {
	if (tooltipSpan.textContent || tooltipSpan.hasChildNodes()) {
		tooltipSpan.classList.add('tooltip', 'regularTooltip')
		element.appendChild(tooltipSpan)
	} else {
		tooltipSpan.remove()
	}
	element.onmouseover = showTooltip
	element.onmouseout = hideTooltip
}

/** @this Table cell with tooltip */
function showTooltip() {
	const tooltipNode = this.querySelector('.regularTooltip')
	if (!tooltipNode || !tooltipNode.classList) return
	// Move tooltip up in the bottom half of the table (dynamically because of sorting)
	if (!tooltipNode.getAttribute('static')) {
		if (this.parentNode.rowIndex > this.parentNode.parentNode.childElementCount / 2) {
			tooltipNode.classList.remove('tooltipShiftedLeft')
			tooltipNode.classList.add('tooltipShiftedUpAndLeft')
		} else {
			tooltipNode.classList.remove('tooltipShiftedUpAndLeft')
			tooltipNode.classList.add('tooltipShiftedLeft')
		}
	}
	tooltipNode.style.display = 'inline'
}

/** @this Table cell with tooltip */
function hideTooltip() {
	const tooltipNode = this.querySelector('.regularTooltip')
	if (!tooltipNode || !tooltipNode.classList) return
	tooltipNode.style.display = 'none'
}

function addWarningToTooltip(tooltipSpan, message) {
	const messageDiv = document.createElement('div')
	messageDiv.classList.add('tooltipWarning')
	messageDiv.innerHTML = message
	tooltipSpan.appendChild(messageDiv)
}

function addSimpleTooltip(element, content) {
	const tooltipSpan = document.createElement('span')
	tooltipSpan.innerHTML = content
	tooltipSpan.classList.add('tooltip', 'regularTooltip')
	tooltipSpan.setAttribute('static', true)
	assignTooltip(element, tooltipSpan)
	return tooltipSpan
}

function addHelpTooltip(element, content) {
	const tooltipSpan = document.createElement('span')
	tooltipSpan.innerHTML = content
	tooltipSpan.classList.add('tooltip', 'helpTooltip')
	tooltipSpan.setAttribute('static', true)
	element.appendChild(tooltipSpan)
	tooltipSpan.style['margin-left'] = -(tooltipSpan.clientWidth / 2) + 'px'
}

// --- Actions ---------------------------------------------------------------------------------------

function toggleSection(section, ev, tableProps) {
	if (ev) ev.stopPropagation()
	section.hidden = 1 - section.hidden

	let cellsToToggle = [...document.getElementsByClassName(section.toggleClass)]

	if (section.dependentClasses) {
		for (let dependentClass of section.dependentClasses) {
			const dependentCells = [...document.getElementsByClassName(dependentClass.name)]
			if (section.hidden || !tableProps.sections[dependentClass.dependsOn].hidden) {
				// Add dependent cells if hiding section or if showing section and other section is shown
				cellsToToggle = [...cellsToToggle, ...dependentCells]
			}
			if (!section.hidden && tableProps.sections[dependentClass.dependsOn].hidden) {
				// Remove dependent cells if showing section and other section is hidden (since they may intersect with the main class cells)
				cellsToToggle = cellsToToggle.filter(x => !dependentCells.includes(x))
			}
		}
	}

	// Additional toggle classes have no dependencies (currently only used for quickPreviewTaskUnreachable)
	if (section.toggleClass2) cellsToToggle = [...cellsToToggle, ...document.getElementsByClassName(section.toggleClass2)]
	if (section.toggleClass3) cellsToToggle = [...cellsToToggle, ...document.getElementsByClassName(section.toggleClass3)]

	// Actually toggle the cells
	for (let cell of cellsToToggle) {
		if (!cell.classList.contains('alwaysVisible')) {
			cell.style.display = section.hidden ? 'none' : 'table-cell'
		}
	}

	if (section.checkbox) {
		// Correct the checkbox state during initial call or if the click was on the label
		const initializing = !ev // There is no event during the initial call
		const checkbox = document.getElementById(section.checkbox)
		if (initializing || ev.target.id != section.checkbox) {
			checkbox.checked = !section.hidden
		}
	}

	if (section.stateStorageId) {
		localStorage.setItem(section.stateStorageId, section.hidden)
	}
	return section.hidden
}

function togglePseudoKingdoms() {
	pseudoKingdomsAreShown = 1 - pseudoKingdomsAreShown
	localStorage.setItem(constants.LOCALSTORAGE_SHOW_PSEUDO_KINGDOMS, pseudoKingdomsAreShown)
	updatePseudoKingdoms()
}

function updatePseudoKingdoms() {
	const checkbox = document.getElementById('menuIconShowPseudoKingdoms')
	checkbox.checked = pseudoKingdomsAreShown == '1'
	const mainTable = document.getElementById('mainTable')
	const hiddenTable = document.getElementById('hiddenTable')
	for (let id of constants.PSEUDO_KINGDOM_IDS) {
		const tr = document.getElementById('row-' + id)
		if (pseudoKingdomsAreShown == '1') {
			mainTable.tBodies[0].appendChild(tr)
			sorttable.resort(mainTable)
		} else {
			hiddenTable.tBodies[0].appendChild(tr)
		}
	}
}

function toggleMaxPowerKingdoms(tableProps) {
	maxPowerKingdomsAreShown = 1 - maxPowerKingdomsAreShown
	localStorage.setItem(constants.LOCALSTORAGE_SHOW_MAX_POWER_KINGDOMS, maxPowerKingdomsAreShown)
	updateMaxPowerKingdoms(tableProps)
}

function updateMaxPowerKingdoms(tableProps) {
	const checkbox = document.getElementById('menuIconShowMaxPowerKingdoms')
	checkbox.checked = maxPowerKingdomsAreShown == '1'
	const mainTable = document.getElementById('mainTable')
	const hiddenTable = document.getElementById('hiddenTable')
	for (let kingdom of tableProps.trueKingdoms.filter(x => x.powerLevel == x.maxPowerLevel)) {
		const tr = document.getElementById('row-' + kingdom.id)
		if (maxPowerKingdomsAreShown == '1') {
			mainTable.tBodies[0].appendChild(tr)
			sorttable.resort(mainTable)
		} else {
			hiddenTable.tBodies[0].appendChild(tr)
		}
	}
}

function toggleMenu(ev) {
	if (ev) ev.stopPropagation()
	hideHelp()
	hideDonate()
	hideQuickHelp()
	document.getElementById('menu').classList.toggle('hidden')
	menuIsShown = 1 - menuIsShown
	document.onclick = menuIsShown ? toggleMenu : anyHelpBoxIsShown ? document.onclick : null
}

function switchPage(pageId) {
	if (activePage != pageId) {
		activePage = pageId
		updateUrlParam('page', activePage == 0 ? null : PAGES[activePage])
		showPage()
	}
}

// Show the selected page
function showPage() {
	if (menuIsShown) toggleMenu()
	if (anyHelpBoxIsShown) {
		hideHelp()
		hideDonate()
		hideQuickHelp()
	}
	for (let p = 0; p < PAGES.length; p++) {
		document.getElementById(BACKGROUNDS[p]).classList.add('hidden')
		document.getElementById(PAGE_ELEMENTS[p]).classList.remove('active')
	}
	document.getElementById(BACKGROUNDS[activePage]).classList.remove('hidden')
	document.getElementById(PAGE_ELEMENTS[activePage]).classList.add('active')
}

function showHelp(ev, helpPageId) {
	if (ev) ev.stopPropagation()
	if (menuIsShown) toggleMenu()
	document.getElementById('helpWindow').classList.remove('hidden')
	showHelpPage(helpPageId)
	anyHelpBoxIsShown = 1
	document.onclick = function (ev) {
		hideHelp(ev)
	}
}

function showHelpPage(activePageId) {
	for (let pageId of HELP_PAGES) {
		document.getElementById(pageId).classList.add('hidden')
	}
	document.getElementById(HELP_PAGES[activePageId]).classList.remove('hidden')
}

function hideHelp(ev) {
	if (ev && ev.target.closest('#helpWindow')) return
	document.getElementById('helpWindow').classList.add('hidden')
	anyHelpBoxIsShown = 0
	document.onclick = null
}

function showDonate(ev) {
	ev.stopPropagation()
	if (menuIsShown) toggleMenu()
	document.getElementById('donate').classList.remove('hidden')
	anyHelpBoxIsShown = 1
	document.onclick = hideDonate
}

function hideDonate() {
	document.getElementById('donate').classList.add('hidden')
	anyHelpBoxIsShown = 0
	document.onclick = null
}

function showQuickHelp(ev) {
	if (ev) ev.stopPropagation()
	if (menuIsShown) toggleMenu()
	switchPage(0)
	const quickHelpCloser = document.getElementById('quickHelpCloser')
	quickHelpCloser.classList.remove('hidden')
	anyHelpBoxIsShown = 1
	let helpCells = [...document.getElementsByClassName('helpTooltip')]
	for (let cell of helpCells) {
		cell.style.display = 'inline'
	}
	quickHelpCloser.onclick = function () {
		hideQuickHelp()
	}
}

function hideQuickHelp() {
	const quickHelpCloser = document.getElementById('quickHelpCloser')
	quickHelpCloser.classList.add('hidden')
	anyHelpBoxIsShown = 0
	let helpCells = [...document.getElementsByClassName('helpTooltip')]
	for (let cell of helpCells) {
		cell.style.display = 'none'
	}
}

function hideInitialHint() {
	document.getElementById('initialHint').style.display = 'none'
	document.onclick = null // Only callable once
	localStorage.setItem(constants.LOCALSTORAGE_SEEN_INITIAL_HINT, true)
	hideQuickHelp()
}

function switchTraitstones(groupIndex, tableProps) {
	simulatedTraitstonesOn += unlimitedTraitstones[groupIndex] ? -1 : 1
	unlimitedTraitstones[groupIndex] = 1 - unlimitedTraitstones[groupIndex]
	document.getElementById('simTable').childNodes[groupIndex].childNodes[1].classList.toggle('hidden')
	traitstones = common.parseTraitstones(data.inventory, unlimitedTraitstones)

	for (let kingdom of tableProps.trueKingdoms) {
		common.analyzeTraitableTroops(kingdom, traitstones, data.unlockedUnderworld, simulatedTraitstonesOn)
		let mainTableRow = document.getElementById('row-' + kingdom.id)
		let cellIndex
		// Find first task column
		for (let [i, column] of tableProps.columns.entries()) {
			if (column.classes && column.classes.includes('task')) {
				cellIndex = i
				break
			}
		}

		// Update tasks and quick previews
		const quickPreviewTable = document.getElementById('quickPreviewTable-' + kingdom.id)
		let quickPreviewRow
		for (let [i, task] of [...kingdom.tasks, ...kingdom.previewTasks.flat(1)].entries()) {
			quickPreviewRow = quickPreviewTable.rows[Math.floor(i / 3) + 1]
			// Account for power level columns
			if (task.isPreview && task.column == 1) cellIndex++
			// Account for locked tasks (that have one fewer cell)
			if (task.locked) cellIndex--
			if (
				!task.completed &&
				(task.type == constants.TASK_TYPE_TRAIT_TROOPS || task.type == constants.TASK_TYPE_TRAIT_CLASS)
			) {
				common.analyzeTask(
					task,
					kingdom,
					traitstones,
					tableProps.unlockedUnderworld,
					simulatedTraitstonesOn,
					tableProps.haveFullData
				)
				renderCanCell(task, mainTableRow.cells[cellIndex + 2])
				renderCanCell(task, quickPreviewRow.cells[(i % 3) * 3 + 3])
			}
			cellIndex += 3
			// Account for Quick preview column
			if (!task.isPreview && task.column == 3) cellIndex++
		}
	}
	renderTaskQuickHelp()
}

// --- Subpages ---------------------------------------------------------------------------------------

function calculateTraitstoneReqs(tableProps) {
	let includeMisc = document.getElementById('includeMisc').checked == true
	let includeMythics = document.getElementById('includeMythics').checked == true
	let includeUnowned = document.getElementById('includeUnowned').checked == true
	let includeUnreleased = document.getElementById('includeUnreleased').checked == true

	let traitstonesRequired = new Array(40).fill(0)
	const trueKingdomIds = tableProps.trueKingdoms.map(k => k.id)

	for (let traitable of [
		...Object.values(data.troops).filter(
			x =>
				x.traitCount < 3 &&
				(includeMisc || !x.kingdoms.length == 1 || trueKingdomIds.includes(x.kingdoms[0])) &&
				(includeMythics || x.baseRarity != 6) &&
				(includeUnowned || x.count > 0) &&
				(includeUnreleased || x.released)
		),
		...Object.values(data.classes),
	]) {
		traitstonesRequired = traitstonesRequired.map((x, i) => x + traitable.traitCostsDecoded[i])
	}
	return traitstonesRequired
}

function updateTraitstoneTable(tableProps) {
	const required = calculateTraitstoneReqs(tableProps)

	let tsCounts = []
	for (let i = 0; i < 40; i++) {
		tsCounts[i] = {
			id: i,
			required: required[i],
			owned: data.inventory.traitstones[i] || 0,
			missing: required[i] - (data.inventory.traitstones[i] || 0),
		}
	}
	tsCounts.sort(common.sortFn('missing'))
	tsCounts.reverse()

	const tsTableContent = document.getElementById('tsTableContent')
	tsTableContent.textContent = ''

	let tsGroupDiv = document.createElement('div')
	tsTableContent.appendChild(tsGroupDiv)
	for (let g of [0, 1, 2, 4, 3]) {
		const group = constants.TRAITSTONE_GROUPS[g]
		let stoneGroup = tsCounts.filter(x => x.id >= Number(group[1]) && x.id <= Number(group[2]))
		if (g == 3) {
			tsGroupDiv = document.createElement('div')
			tsTableContent.appendChild(tsGroupDiv)
		} else if (g > 0) {
			const spacer = document.createElement('div')
			spacer.classList.add('tsTableSpacer')
			tsGroupDiv.appendChild(spacer)
		}

		for (let stone of stoneGroup) {
			let tsCount = tsCounts.find(c => c.id == stone.id)
			const diff = -tsCount.missing

			const tsBarBg = document.createElement('div')
			tsBarBg.classList.add('tsBarBg')
			tsGroupDiv.appendChild(tsBarBg)

			if (tsCount.required > 0 && tsCount.owned > 0) {
				const tsBar = document.createElement('div')
				tsBar.classList.add('tsBar')
				if (diff >= 0) tsBar.classList.add('complete')
				tsBar.style.width = Math.min((tsCount.owned / tsCount.required) * 100, 100) + '%'
				tsBar.innerHTML = '&nbsp;'
				tsBarBg.appendChild(tsBar)
			}

			const tsTextLeft = document.createElement('div')
			tsTextLeft.classList.add('tsTextLeft')
			const tsIcon = createIcon('traitstones/' + (tsCount.id < 10 ? '0' : '') + tsCount.id + '_small', 4)
			tsIcon.classList.add('xLargeIcon')
			tsIcon.classList.add('tsIcon')
			tsTextLeft.appendChild(tsIcon)
			tsTextLeft.innerHTML += '<span class="tsOwned">' + tsCount.owned + '&nbsp;/&nbsp;' + tsCount.required + '</span>'
			tsBarBg.appendChild(tsTextLeft)

			const tsTextRight = document.createElement('div')
			tsTextRight.classList.add('tsTextRight')
			if (diff >= 0) tsTextRight.classList.add('excess')
			tsTextRight.innerHTML = (diff == 0 ? '' : diff > 0 ? '+' : '-') + Math.abs(diff)
			tsBarBg.appendChild(tsTextRight)

			// Tooltip
			// TODO: move all tooltip stuff to a separate module
			let kingdomNames = ''
			let kingdomNamesLowChance = ''

			if (g == 3) {
				const kingdomsWithTraitstone = Object.values(data.kingdoms).filter(x => x.traitstone == tsCount.id)
				let firstKingdom = true
				for (let kingdom of kingdomsWithTraitstone) {
					if (firstKingdom) {
						firstKingdom = false
					} else {
						kingdomNames += ',<br>'
					}
					kingdomNames += kingdom.name
				}
			} else if (g == 4) {
				kingdomNames = 'All kingdoms'
			} else {
				const kingdomWithTraitstoneHighChance = Object.values(data.kingdoms).find(
					x => x.isTrueKingdom && x.exploreTraitstones.length == 5 && x.exploreTraitstones.includes(tsCount.id)
				)
				const kingdomsWithTraitstoneLowChance = Object.values(data.kingdoms).filter(
					x => x.isTrueKingdom && x.exploreTraitstones.length == 8 && x.exploreTraitstones.includes(tsCount.id)
				)
				if (kingdomWithTraitstoneHighChance)
					kingdomNames = '<b>High chance:</b><br>' + kingdomWithTraitstoneHighChance.name
				if (kingdomsWithTraitstoneLowChance.length > 0) {
					kingdomNamesLowChance = '<b>Low chance:</b><br>'
					let firstKingdom = true
					for (let kingdom of kingdomsWithTraitstoneLowChance) {
						if (firstKingdom) {
							firstKingdom = false
						} else {
							kingdomNamesLowChance += ',<br>'
						}
						kingdomNamesLowChance += kingdom.name
					}
				}
			}

			const tooltipSpan = document.createElement('span')
			let sectionDiv = document.createElement('div')

			const titleDiv = document.createElement('div')
			titleDiv.textContent = data.inventory.traitstoneNames[tsCount.id]
			titleDiv.classList.add('tooltipHeader')
			sectionDiv.appendChild(titleDiv)

			sectionDiv.innerHTML += kingdomNames
			sectionDiv.classList.add('tooltipSection')
			tooltipSpan.appendChild(sectionDiv)
			if (kingdomNamesLowChance.length > 0) {
				sectionDiv = document.createElement('div')
				sectionDiv.innerHTML = kingdomNamesLowChance
				sectionDiv.classList.add('tooltipSection')
				tooltipSpan.appendChild(sectionDiv)
			}

			assignTooltip(tsBarBg, tooltipSpan)
			tooltipSpan.classList.add('tooltipShiftedWayDown')
		}
	}
}

function renderAchievementsPage(achs) {
	const achContent = document.getElementById('achContent')
	for (let group of achs) {
		let achGroupDiv = document.createElement('div')
		achGroupDiv.classList.add('achGroup')
		achContent.appendChild(achGroupDiv)
		const achGroupLabel = document.createElement('div')
		achGroupLabel.classList.add('achGroupLabel')
		achGroupLabel.textContent = group.name
		achGroupDiv.appendChild(achGroupLabel)
		for (let ach of group.achievements) {
			const achLabel = document.createElement('div')
			achLabel.classList.add('achLabel')
			if (ach.newGroup) achLabel.classList.add('achNewGroup')
			achLabel.textContent = ach.name
			achGroupDiv.appendChild(achLabel)

			const achBarBg = document.createElement('div')
			achBarBg.classList.add('achBarBg')
			const achBar = document.createElement('div')
			achBar.innerHTML += '&nbsp;' + ach.value + ' / ' + ach.maxValue
			if (ach.categoryText) achBar.innerHTML += '&nbsp;' + ach.categoryText
			achBar.classList.add('achBar')
			if (ach.value >= ach.maxValue) achBar.classList.add('complete')
			achBar.style.width = Math.min((ach.value / ach.maxValue) * 100, 100) + '%'
			achBarBg.appendChild(achBar)
			achGroupDiv.appendChild(achBarBg)

			if (ach.missing) {
				const tooltipSpan = document.createElement('span')
				const titleDiv = document.createElement('div')
				titleDiv.textContent = 'Missing: '
				titleDiv.classList.add('tooltipHeader')
				tooltipSpan.appendChild(titleDiv)
				const listDiv = document.createElement('div')
				listDiv.innerHTML = ach.missing
				tooltipSpan.appendChild(listDiv)
				tooltipSpan.setAttribute('static', true)
				tooltipSpan.classList.add('scrollableTooltip')
				assignTooltip(achBarBg, tooltipSpan)
			}
		}
		if (group.name == 'Weapons') {
			const footnote = document.createElement('div')
			footnote.classList.add('achFootNote')
			footnote.innerHTML = TOOLTIP_NO_WEAPON_DATA
			achGroupDiv.appendChild(footnote)
		}
	}
}

// --- Misc ---------------------------------------------------------------------------------------

function readUrlParams() {
	const queryString = window.location.search
	const urlParams = new URLSearchParams(queryString)
	if (urlParams.has('page')) {
		activePage = PAGES.indexOf(urlParams.get('page'))
		if (activePage == -1) activePage = 0
	} else {
		activePage = 0
	}
	if (urlParams.has('beta')) {
		BETA_FEATURES = 1
	}
	if (urlParams.has('dev')) {
		DEV_FEATURES = 1
	}
}

function updateUrlParam(paramToModify, newValue) {
	var newParams = ''
	var splitOnQuestionMark = window.location.href.split('?')
	var baseURL = splitOnQuestionMark[0]
	var params = splitOnQuestionMark[1]
	var separator = ''
	let found = false
	if (params) {
		for (let elem of params.split('&')) {
			if (elem.split('=')[0] != paramToModify) {
				newParams += separator + elem
				separator = '&'
			} else {
				found = true
				if (newValue != null) {
					newParams += separator + paramToModify + '=' + newValue
					separator = '&'
				}
			}
		}
	}
	if (!found && newValue != null) newParams += separator + paramToModify + '=' + newValue
	window.history.pushState('', '', baseURL + '?' + newParams)
}

function shortenTaskLabel(label, kingdomName, className) {
	let result = label
	for (let shortenRegEx of SHORTEN_TASK_NAMES) {
		result = result.replace(shortenRegEx[0], shortenRegEx[1])
	}
	result = result.replace('the  class', className)
	result = result.replace('{Kingdom}', kingdomName)
	return result
}

function createIcon(name, size, classes) {
	const icon = document.createElement('img')
	icon.src = '/images/' + name + '.png'
	switch (size) {
		case 1:
			if (name == 'souls') {
				icon.classList.add('smallSouls')
			} else {
				icon.classList.add('smallIcon')
			}
			break
		case 2:
			if (name == 'doomskull') {
				icon.classList.add('mediumDoomskull')
			} else {
				icon.classList.add('mediumIcon')
			}
			break
		case 3:
			icon.classList.add('largeIcon')
			break
		case 4:
			icon.classList.add('xLargeIcon')
			break
	}
	if (classes) icon.classList.add(classes)
	return icon
}

function createGowDBLink(type, id, text) {
	const a = document.createElement('a')
	a.textContent = text
	a.href = 'https://gowdb.com/' + type + '/' + id
	a.target = '_blank'
	a.rel = 'noopener noreferrer'
	return a
}

function formatDate(unixDate) {
	const date = new Date(unixDate)
	return date.toString().slice(4, 7) + ' ' + date.getDate()
}

function makeSpan(content) {
	const elem = document.createElement('span')
	elem.textContent = content
	return elem
}

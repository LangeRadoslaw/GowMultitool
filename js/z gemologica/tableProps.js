import constants from './constants.js'

const LABEL_CHECKBOX_SHOW_UNREACHABLE_TASKS = 'Show unreachable tasks'
const ID_CHECKBOX_SHOW_UNREACHABLE_TASKS = 'menuIconShowUnreachableTasks'

function generateTableProps(playerData) {
	let tableProps = {}
	tableProps.haveFullData = playerData.fullData
	tableProps.trueKingdoms = Object.values(playerData.kingdoms).filter(x => x.tasks.length > 0) // TODO duplicated
	tableProps.pseudoKingdoms = Object.values(playerData.kingdoms).filter(x =>
		constants.PSEUDO_KINGDOM_IDS.includes(x.id)
	)
	tableProps.renderedKingdoms = [...tableProps.trueKingdoms, ...tableProps.pseudoKingdoms]
	tableProps.unlockedUnderworld = tableProps.trueKingdoms.length >= 25
	tableProps.maxKingdomPets =
		tableProps.trueKingdoms
			.map(
				x =>
					x.pets.filter(p => p.type == 2 || p.type == 3 || p.type == 4).length // all regular pets and all mythic event pets
			)
			.reduce((max, val) => (max < val ? val : max), 0) + 1 // Always +1 for faction pet
	tableProps.maxKingdomShinyTroops = tableProps.trueKingdoms
		.map(x => x.troops.filter(t => t.shiny).length)
		.reduce((max, val) => (max < val ? val : max), 0)
	tableProps.taskColumnsComplete = findCompletedTaskColumns(tableProps.trueKingdoms)
	tableProps.collapsedTaskColumns = tableProps.taskColumnsComplete.reduce((sum, val) => (val ? sum + 2 : sum), 0)

	// WARNING: set calculated = true for new calculated columns!
	// ***********************************************************
	tableProps.columns = [
		// *** Kingdoms ******************************
		{
			name: 'Kingdom',
			attribute: 'name',
			section: {
				name: 'Kingdoms',
				toggleClass: 'kingdom',
				hidden: 1,
			},
			classes: ['kingdom', 'alwaysVisible'],
		},
		{
			name: 'Skill',
			attribute: 'levelStat',
			classes: ['kingdom', 'alwaysVisible'],
			classesOnCells: ['centered'],
		},
		{
			name: 'Power',
			attribute: 'powerLevel',
			classes: ['kingdom', 'alwaysVisible'],
			classesOnHeader: ['sorttable_default'],
			classesOnCells: ['bolded', 'centered'],
		},
		{
			name: 'Max',
			attribute: 'maxPowerLevel',
			classes: ['kingdom', 'alwaysVisible'],
			classesOnCells: ['centered'],
		},
		{
			name: 'Level',
			attribute: 'level',
			maxValue: constants.MAX_KINGDOM_LEVEL,
			classes: ['kingdom'],
			classesOnCells: ['centered'],
		},
		{
			name: 'Where',
			attribute: 'location',
			classes: ['kingdom'],
			classesOnCells: ['centered'],
		},
		{
			name: 'Deed',
			attribute: 'deedColor',
			classes: ['kingdom'],
			classesOnCells: ['centered'],
		},
		{
			name: 'Stone',
			attribute: 'traitstone',
			classes: ['kingdom'],
			classesOnCells: ['centered', 'unpaddedCell'],
		},
		{
			name: '',
			attribute: 'tributeGold',
			classes: ['kingdom'],
			classesOnCells: ['numeric'],
			icon: 'gold',
		},
		{
			name: '',
			attribute: 'tributeGlory',
			classes: ['kingdom'],
			classesOnCells: ['numeric'],
			icon: 'glory',
		},
		{
			name: '',
			attribute: 'tributeSouls',
			classes: ['kingdom'],
			classesOnCells: ['numeric'],
			icon: 'souls',
		},
		{
			name: 'Troops',
			attribute: 'ownedTroops',
			calculated: true,
			classes: ['kingdom'],
			classesOnCells: ['centered'],
		},
		{
			name: 'At Level 20',
			attribute: 'ownedTroopsAtLevel20',
			calculated: true,
			classes: ['kingdom'],
			classesOnCells: ['centered'],
		},
		{
			name: 'Traited',
			attribute: 'ownedTroopsTraited',
			calculated: true,
			classes: ['kingdom'],
			classesOnCells: ['centered'],
		},
		{
			name: '',
			icon: 'medal0',
			attribute: 'ownedTroopsMedaledNone',
			calculated: true,
			classes: ['kingdom'],
			classesOnCells: ['centered'],
		},
		{
			name: '',
			icon: 'medal1',
			attribute: 'ownedTroopsMedaledBronze',
			calculated: true,
			classes: ['kingdom'],
			classesOnCells: ['centered'],
		},
		{
			name: '',
			icon: 'medal2',
			attribute: 'ownedTroopsMedaledSilver',
			calculated: true,
			classes: ['kingdom'],
			classesOnCells: ['centered'],
		},
		{
			name: '',
			icon: 'medal3',
			attribute: 'ownedTroopsMedaledGold',
			calculated: true,
			classes: ['kingdom'],
			classesOnCells: ['centered'],
		},
		{
			name: 'Weapons',
			attribute: 'ownedWeapons',
			calculated: true,
			classes: ['kingdom'],
			classesOnCells: ['centered'],
		},
		{
			name: 'Pets',
			attribute: 'ownedPets',
			calculated: true,
			classes: ['kingdom'],
			classesOnCells: ['centered'],
		},
		{
			name: 'Trial',
			attribute: 'challengeTier',
			maxValue: 10,
			classes: ['kingdom'],
			classesOnCells: ['centered'],
		},

		// *** Factions ******************************
		{
			name: 'Faction',
			attribute: 'faction',
			section: {
				name: 'Factions',
				toggleClass: 'faction',
				hidden: 1,
			},
			classes: ['faction', 'alwaysVisible'],
		},
		{
			name: 'Colors',
			attribute: 'factionColors',
			calculated: true,
			classes: ['faction'],
			classesOnCells: ['centered'],
		},
		{
			name: 'Faction Weapon',
			attribute: 'factionWeapon',
			classes: ['faction'],
		},
		{
			name: 'Troops',
			attribute: 'factionTroops',
			calculated: true,
			classes: ['faction'],
			classesOnCells: ['centered'],
		},
		{
			name: 'Hoard L',
			attribute: 'hoardLevel',
			classes: ['faction'],
			classesOnCells: ['centered'],
		},
		{
			name: 'Hoard Q',
			attribute: 'hoardQuality',
			maxValue: 10,
			classes: ['faction'],
			classesOnCells: ['centered'],
		},
		{
			name: 'Lvl',
			attribute: 'maxLevel',
			maxValue: 500,
			classes: ['faction'],
			classesOnCells: ['centered'],
		},
		{
			name: 'Lvl FT',
			attribute: 'maxLevelFactionOnly',
			maxValue: 500,
			classes: ['faction'],
			classesOnCells: ['centered'],
		},
		{
			name: 'Renown',
			attribute: 'renown',
			maxValue: 2500,
			classes: ['faction', 'alwaysVisible'],
			classesOnCells: ['centered'],
		},
		{
			name: 'Rush',
			attribute: 'rushRooms',
			classes: ['faction'],
			classesOnCells: ['centered'],
		},

		// *** Classes ******************************
		{
			name: 'Class',
			attribute: 'class',
			section: {
				name: 'Classes',
				toggleClass: 'class',
				hidden: 1,
			},
			classes: ['class', 'alwaysVisible'],
		},
		{
			name: 'CLevel',
			attribute: 'championLevel',
			maxValue: 100,
			classes: ['class'],
			classesOnHeader: ['alwaysVisible'],
			classesOnCells: ['centered', 'alwaysVisible'],
		},
		{
			name: 'XP',
			attribute: 'xp',
			calculated: true,
			maxValue: 100,
			classes: ['class'],
			classesOnCells: ['centered'],
		},
		{
			name: 'Total XP',
			attribute: 'championXP',
			classes: ['class'],
			classesOnCells: ['centered'],
		},
		{
			name: 'Level',
			attribute: 'classLevel',
			maxValue: 20,
			classes: ['class'],
			classesOnCells: ['centered'],
		},
		{
			name: 'Tribe',
			attribute: 'tribe',
			classes: ['class'],
		},
		{
			name: 'Class Weapon',
			attribute: 'classWeapon',
			classes: ['class'],
		},
		{
			name: 'Storm',
			attribute: 'class_storms',
			classes: ['class'],
			classesOnCells: ['centered'],
		},
		{
			name: '+Mana',
			attribute: 'class_bonusMana',
			classes: ['class'],
			classesOnCells: ['centered'],
		},
		{
			name: '50% Start',
			attribute: 'class_start50',
			classes: ['class'],
			classesOnCells: ['centered'],
		},
		{
			name: 'Explode',
			attribute: 'class_explosions',
			classes: ['class'],
			classesOnCells: ['centered'],
		},
		{
			name: 'Barrier',
			attribute: 'class_barrier',
			classes: ['class'],
			classesOnCells: ['centered'],
		},
		{
			name: 'Hunt',
			attribute: 'class_hunt',
			classes: ['class'],
			classesOnCells: ['centered'],
		},
		{
			name: 'Tangle',
			attribute: 'class_tangle',
			classes: ['class'],
			classesOnCells: ['centered'],
		},
		{
			name: 'Cleanse',
			attribute: 'class_cleanse',
			classes: ['class'],
			classesOnCells: ['centered'],
		},
		{
			name: 'Banish',
			attribute: 'class_banishment',
			classes: ['class'],
			classesOnCells: ['centered'],
		},
		{
			name: 'Stealth',
			attribute: 'class_stealth',
			section: {
				name: 'Pets',
				toggleClass: 'pet',
				hidden: 1,
			},
			classesOnSectionHeader: ['pet', 'alwaysVisible'],
			classesOnHeader: ['class'],
			classesOnCells: ['class', 'centered'],
		},
	]

	// *** Pets ******************************
	for (let col = 0; col < tableProps.maxKingdomPets; col++) {
		tableProps.columns.push({
			name: col == 0 ? 'Faction Pet' : col == 1 ? 'Starry Pet' : 'Pet',
			attribute: 'petName' + col,
			calculated: true,
			classes: ['pet'],
		})
	}

	// *** Shiny troops ******************************
	tableProps.columns.push({
		name: 'Shiny Troop',
		attribute: 'shinyName0',
		section: {
			name: 'Shiny Troops',
			toggleClass: 'shinyTroop',
			hidden: 1,
		},
		calculated: true,
		classes: ['shinyTroop'],
		classesOnSectionHeader: ['alwaysVisible'],
	})
	for (let col = 1; col < tableProps.maxKingdomShinyTroops; col++) {
		tableProps.columns.push({
			name: 'Shiny Troop',
			attribute: 'shinyName' + col,
			calculated: true,
			classes: ['shinyTroop'],
		})
	}

	// *** Tasks ******************************
	tableProps.columns.push(
		{
			name: 'Task 1',
			section: {
				name: 'Current Tasks',
				toggleClass: 'task',
				dependentClasses: [
					{
						name: 'taskDependent',
						dependsOn: 'preview',
					},
				],
				hidden: 0,
			},
			colSpan: 3,
			classes: ['task'],
			classesOnSectionHeader: ['alwaysVisible'],
			classesOnHeader: ['descColumn1'],
			classesOnCells: ['descColumn1'],
		},
		{
			name: 'Need',
			hidden: tableProps.taskColumnsComplete[1],
			classes: ['task'],
			classesOnCells: ['centered'],
		},
		{
			name: 'Can',
			hidden: tableProps.taskColumnsComplete[1],
			classes: ['task'],
			classesOnCells: ['centered'],
		},
		{
			name: 'Task 2',
			simToolbar: true,
			colSpan: 4 - tableProps.collapsedTaskColumns + (tableProps.taskColumnsComplete[3] ? 1 : 0),
			colCover: 4, // "Permanent column span": replace this many cells even if some are collapsed/hidden
			classes: ['task'],
			classesOnSectionHeader: ['simToolbarParent'],
			classesOnHeader: ['gap'],
			classesOnCells: ['gap'],
		},
		{
			name: 'Need',
			hidden: tableProps.taskColumnsComplete[2],
			classes: ['task'],
			classesOnCells: ['centered'],
		},
		{
			name: 'Can',
			hidden: tableProps.taskColumnsComplete[2],
			classes: ['task'],
			classesOnCells: ['centered'],
		},
		{
			name: 'Task 3',
			classes: ['task'],
			classesOnHeader: ['gap'],
			classesOnCells: ['gap'],
		},
		{
			name: 'Need',
			section: {
				name: 'Preview All',
				toggleClass: 'preview',
				dependentClasses: [
					{
						name: 'taskDependent',
						dependsOn: 'task',
					},
					{
						name: 'taskUnreachable',
						dependsOn: 'taskUnreachable',
					},
				],
				hidden: 1,
				stateStorageId: constants.LOCALSTORAGE_HIDE_PREVIEWS,
			},
			colSpan: 3 + (tableProps.taskColumnsComplete[3] ? 1 : 0),
			colCover: 3 + (tableProps.taskColumnsComplete[3] ? 2 : 0),
			hidden: tableProps.taskColumnsComplete[3],
			classesOnSectionHeader: ['preview', 'alwaysVisible'],
			classesOnHeader: ['task'],
			classesOnCells: ['task', 'centered'],
		},
		{
			name: 'Can',
			hidden: tableProps.taskColumnsComplete[3],
			classes: ['task'],
			classesOnCells: ['centered'],
		}
	)

	// *** Quick Preview ******************************
	tableProps.columns.push({
		name: 'Preview',
		isQuickPreview: true,
		// quickPreviewHover is only for attaching the quick help tooltip
		classes: ['preview', 'alwaysVisible', 'sorttable_nosort', 'quickPreviewHover'],
		classesOnCells: ['centered'],
	})

	// *** Previews ******************************
	tableProps.maxPreviewLevels = Math.max(...Object.values(playerData.kingdoms).map(k => k.previewTasks.length))
	for (let i = 0; i < tableProps.maxPreviewLevels; i++) {
		let columns = [
			{
				name: 'Power',
				classes: ['preview'],
				classesOnHeader: ['gap'],
				classesOnCells: ['centered', 'bolded', 'gap'],
			},
		]
		if (i > 0) columns[0].classes.push('gap')
		for (let t = 1; t <= 3; t++) {
			columns.push(
				...[
					{
						name: 'Level +' + (i + 1) + ', Task ' + t,
						classes: ['preview'],
						classesOnHeader: ['gap'],
						classesOnCells: ['gap'],
					},
					{
						name: 'Need',
						classes: ['preview'],
						classesOnCells: ['centered'],
					},
					{
						name: 'Can',
						classes: ['preview'],
						classesOnCells: ['centered'],
					},
				]
			)
		}
		if (i == 0) {
			columns[4].colSpan = 3
			columns[4].classesOnSectionHeader = ['taskDependent']
		}
		if (i >= playerData.maxRemainingPowerLevels) {
			columns.map(col => col.classes.push('taskUnreachable'))
		}
		// Alt coloring per previewed power level
		if (i % 2 == 1) {
			columns.map(col => col.classes.push('alt'))
		}
		Array.prototype.push.apply(tableProps.columns, columns)
	}

	// Collect all sections
	tableProps.sections = {}
	for (let column of tableProps.columns) {
		if (column.section) tableProps.sections[column.section.toggleClass] = column.section
	}

	// Add section(s) not controlled via table column headers
	tableProps.sections.taskUnreachable = {
		checkbox: ID_CHECKBOX_SHOW_UNREACHABLE_TASKS,
		checkboxLabel: LABEL_CHECKBOX_SHOW_UNREACHABLE_TASKS,
		toggleClass: 'taskUnreachable',
		toggleClass2: 'quickPreviewTaskUnreachable',
		toggleClass3: 'quickPreviewTaskUnreachableDependent',
		dependentClasses: [
			{
				name: 'taskUnreachable',
				dependsOn: 'preview',
			},
		],
		hidden: 1,
		stateStorageId: constants.LOCALSTORAGE_HIDE_UNREACHABLE_TASKS,
	}

	// Read section status from local storage where supported
	for (let sectionId in tableProps.sections) {
		setSectionHiddenStatus(tableProps.sections[sectionId])
	}

	// Column group shortcuts
	tableProps.taskColumns = tableProps.columns.filter(
		c => (c.classes && c.classes.includes('task')) || (c.classesOnCells && c.classesOnCells.includes('task'))
	)
	tableProps.previewColumns = tableProps.columns.filter(
		c => (c.classes && c.classes.includes('preview')) || (c.classesOnHeader && c.classesOnHeader.includes('preview'))
	)
	tableProps.quickPreviewColumn = tableProps.columns.find(c => c.isQuickPreview)

	// Quick preview columns
	tableProps.quickPreviewColumns = tableProps.columns.filter(
		c => (c.classes && c.classes.includes('task')) || (c.classesOnCells && c.classesOnCells.includes('task'))
	)
	// Clone the column definitions to allow independent modification
	tableProps.quickPreviewColumns = JSON.parse(JSON.stringify(tableProps.quickPreviewColumns))
	for (let column of tableProps.quickPreviewColumns) {
		if (!column.classesOnHeader) column.classesOnHeader = []
		column.classesOnHeader = column.classesOnHeader.filter(c => c !== 'task')
		column.classesOnHeader.push('quickPreviewTask')
		if (column.classesOnCells) column.classesOnCells = column.classesOnCells.filter(c => c !== 'task')
		column.classes = ['sorttable_nosort']
		column.hidden = false // TODO calculate
	}
	tableProps.quickPreviewColumns[0].classes.push('gap')
	tableProps.quickPreviewColumns.unshift({
		name: 'Power',
		classes: ['quickPreviewTask', 'sorttable_nosort'],
		classesOnCells: ['centered', 'bolded'],
	})

	return tableProps
}

function findCompletedTaskColumns(trueKingdoms) {
	let taskColumnsComplete = [null, true, true, true]
	for (let kingdom of trueKingdoms) {
		for (let task of kingdom.tasks) {
			if (!task.completed) taskColumnsComplete[task.column] = false
		}
	}
	return taskColumnsComplete
}

function setSectionHiddenStatus(section) {
	if (!section.stateStorageId) return
	const readValue = localStorage.getItem(section.stateStorageId)
	// Set status if there is a saved value, otherwise keep the default
	if (readValue) {
		section.hidden = readValue == '1'
	}
}

export default {
	generateTableProps,
}

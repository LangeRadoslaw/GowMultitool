const allNavBtns = document.querySelectorAll('.nav__btn')
const allSections = document.querySelectorAll('section')
const allPlayerDataHeaderBtns = document.querySelectorAll('.player-data button')
const allClassLevelInputs = document.querySelectorAll('.player-data__class-level-input')
const allKingdomLevelInputs = document.querySelectorAll('.player-data__kingdom-power-input')
const tributesDailyInput = document.querySelector('.tribute__tributes-daily-input')
const averageGemsPerTributeSpan = document.querySelector('.tribute__average-gems-per-tribute-span')
const averageGemsPerDaySpan = document.querySelector('.tribute__average-gems-per-day-span')
const classLevelObj = {}
let currentKingdomName
let currentKingdomPowerLevel
let kingdomPowerLevelObj = {}
let multipliesArr = []
let tributeChancesArr = []
let singleTributeAmount = -1
let allTributesAmountArr = []
let sum
let averageGemsPerTributeCalculated
let newTributeChanceItem
let currentInputValue
let tabToHideClass
let tabToShowClass
let tabToShow
let lastClassClass
let lastKingdomClass
let storedValue

const tributeChanceObj = {
	1: 1,
	2: 1,
	3: 1,
	4: 2,
	5: 2,
	6: 2,
	7: 2,
	8: 2,
	9: 3,
	10: 3,
	11: 3,
	12: 3.25,
	13: 3.25,
	14: 3.5,
	15: 3.5,
	16: 3.5,
	17: 3.75,
	18: 3.75,
	19: 4,
	20: 4,
	21: 4,
	22: 4.25,
	23: 4.25,
	24: 4.5,
	25: 4.5,
	26: 4.5,
	27: 4.75,
	28: 4.75,
	29: 5,
	30: 5,
}

const handleTabs = () => {
	allNavBtns.forEach(btn => {
		btn.addEventListener('click', handleTabClick)
	})
}

const handleTabClick = e => {
	hideAllTabs()
	showActiveTab(e.target)
}

const hideAllTabs = () => {
	allNavBtns.forEach(btn => {
		btn.classList.remove('nav__btn--active')
		const tabToHideClass = btn.classList.toString().slice(14, -4)
		allSections.forEach(section => {
			if (section.classList.contains(tabToHideClass)) {
				section.style.display = 'none'
			}
		})
	})
}

const showActiveTab = target => {
	const tabToShowClass = target.classList.toString().slice(14, -4)
	const tabToShow = document.querySelector(`.${tabToShowClass}`)
	tabToShow.style.display = 'block'
	target.classList.add('nav__btn--active')
}

const handlePlayerDataBodies = () => {
	allPlayerDataHeaderBtns.forEach(item => {
		let target = item.classList.value.slice(13, -11)
		item.addEventListener('click', () => handleBody(target))
	})
}

const handleBody = target => {
	const playerDataBody = document.querySelector(`.player-data__${target}-body`)
	const playerDataHeaderIcon = document.querySelector(`.player-data__${target}-header-icon`)
	const computedHeight = window.getComputedStyle(playerDataBody).height

	if (computedHeight === '0px') {
		playerDataBody.style.height = '430px'
		playerDataBody.style.padding = '1em 0'
		playerDataHeaderIcon.style.transform = 'rotate(180deg)'
	} else {
		playerDataBody.style.height = '0px'
		playerDataBody.style.padding = '0'
		playerDataHeaderIcon.style.transform = 'rotate(0deg)'
	}
}

const setClassLevel = inputElement => {
	const currentClassName = inputElement.classList[inputElement.classList.length - 1]
	currentInputValue = parseInt(inputElement.value)
	const currentClassLevel = currentInputValue
	classLevelObj[currentClassName] = currentClassLevel
	exportInputs(currentClassName, currentClassLevel)
}

const setKingdomPowerLevel = inputElement => {
	// console.log(inputElement)
	// tworzy obiekt {kingdom:power level}
	currentKingdomName = inputElement.classList[inputElement.classList.length - 1]
	// console.log(currentKingdomName)
	// console.log(inputElement.value)
	currentInputValue = parseInt(inputElement.value)
	currentKingdomPowerLevel = currentInputValue
	// console.log(currentKingdomPowerLevel)
	kingdomPowerLevelObj[currentKingdomName] = currentKingdomPowerLevel
	exportInputs(currentKingdomName, currentKingdomPowerLevel)
}

const exportInputs = (name, value) => {
	localStorage.setItem(name, value)
}

const createKingdomPowerLevelObj = () => {
	allKingdomLevelInputs.forEach(input => {
		currentKingdomName = input.classList[input.classList.length - 1]
		currentInputValue = parseInt(input.value)
		currentKingdomPowerLevel = currentInputValue
		kingdomPowerLevelObj[currentKingdomName] = currentKingdomPowerLevel
	})
}

const calculateGemsPerTribute = tributesCollectedDaily => {
	createMultipliesArr()
	createTributeChancesArr()
	gemsPerTribute()
	averageGemsPerTribute()
	showGemsAverages(tributesCollectedDaily)
	calculateGemsBalance()
}

const createMultipliesArr = () => {
	for (const key in kingdomPowerLevelObj) {
		if (tributeChanceObj[kingdomPowerLevelObj[key]]) {
			multipliesArr.push(tributeChanceObj[kingdomPowerLevelObj[key]])
		} else {
			console.log(`Nie znaleziono klucza ${kingdomPowerLevelObj[key]} w drugim obiekcie.`)
		}
	}
}

const createTributeChancesArr = () => {
	// tworzy (38)[] z dodatkiem pozostałych mnożników
	multipliesArr.forEach(el => {
		tributeChancesArr.push(0.16 * el)
	})
}

const gemsPerTribute = () => {
	// symuluje pojedynczy tribut i umieszcza jego wartość w [] ze wszystkimi losowaniami

	tributeChancesArr.forEach(el => {
		if (el >= Math.random()) {
			singleTributeAmount++
		}
	})
	allTributesAmountArr.push(singleTributeAmount)
	singleTributeAmount = -1
}

const averageGemsPerTribute = () => {
	// symuluje 1000 zbiorów tribute i oblicza średnią
	for (i = 1; i < 1000; i++) {
		gemsPerTribute()
	}
	sum = allTributesAmountArr.reduce((acc, num) => acc + num, 0)
	averageGemsPerTributeCalculated = (sum / allTributesAmountArr.length).toFixed(0)
	expensesIncomesSummary == undefined ? (expensesIncomesSummary = 0) : false
}

const showGemsAverages = tributesCollectedDaily => {
	averageGemsPerTributeSpan.textContent = averageGemsPerTributeCalculated
	averageGemsPerDaySpan.textContent = averageGemsPerTributeCalculated * tributesCollectedDaily
	exportTribute(tributesCollectedDaily, averageGemsPerTributeCalculated)
	resetAllGemsValues()
}

const resetAllGemsValues = () => {
	multipliesArr = []
	tributeChancesArr = []
	allTributesAmountArr = []
	averageGemsPerTributeCalculated = 0
}

const exportTribute = (tributesCollectedDaily, averageGemsPerTributeCalculated) => {
	let averageGemsPerDay = averageGemsPerTributeCalculated * tributesCollectedDaily
	localStorage.setItem('tributesCollectedDaily', tributesCollectedDaily)
	localStorage.setItem('averageGemsPerTributeSpan', averageGemsPerTributeCalculated)
	localStorage.setItem('averageGemsPerDaySpan', averageGemsPerDay)
}

// =============== GEM MANAGMENT ================
// ===== WEEKLY =====

const weeklyEventSelect = document.querySelector('.gem-managment__weekly-event-select')
const weeklyEventTierSelect = document.querySelector('.gem-managment__weekly-event-tier-select')
const weeklyEventTotalCostAmount = document.querySelector('.gem-managment__weekly-event-total-cost-amount')
let totalWeeklyEventCost = 0

let gemBountyInput = document.querySelector('.gem-managment__gem-bounty-offer-input')
let dragoniteInput = document.querySelector('.gem-managment__dragonite-offer-input')
gemBountyInput.value = 0
dragoniteInput.value = 0
let gemBountyCost = 0
let dragoniteCost = 0

const underspireSelect = document.querySelector('.gem-managment__underspire-select')
let underspireCost = 0

const epicTrialSelect = document.querySelector('.gem-managment__epic-trial-offer-tier-select')
let epicTrialCost = 0

const factionSelect = document.querySelector('.gem-managment__faction-event-tier-select')
let factionCost = 0

const petRescueSelect = document.querySelector('.gem-managment__pet-rescue-event-tier-select')
let petRescueCost = 0

const classSelect = document.querySelector('.gem-managment__class-event-tier-select')
let classCost = 0

const calculateTotalWeeklyEventCost = tier => {
	switch (parseInt(tier)) {
		case 0:
			totalWeeklyEventCost = 0
			break
		case 1:
			totalWeeklyEventCost = 30
			break
		case 2:
			totalWeeklyEventCost = 100
			break
		case 3:
			totalWeeklyEventCost = 250
			break
		case 4:
			totalWeeklyEventCost = 500
			break
		case 5:
			totalWeeklyEventCost = 850
			break
		case 6:
			totalWeeklyEventCost = 1350
			break
		case 7:
			totalWeeklyEventCost = 1850
			break
		case 8:
			totalWeeklyEventCost = 2350
			break
		case 9:
			totalWeeklyEventCost = 2850
			break
		case 10:
			totalWeeklyEventCost = 3350
			break
		case 11:
			totalWeeklyEventCost = 3850
			break
		default:
			console.log('coś nie pykło')
			return
	}
	showTotalWeeklyEventCost(totalWeeklyEventCost)
	calculateGemsBalance()
	weeklyEventsExport()
}

const showTotalWeeklyEventCost = totalCost => {
	weeklyEventTotalCostAmount.textContent = totalCost
}

const setGemBountyCost = value => {
	gemBountyCost = parseInt(value)
	calculateGemsBalance()
	weeklyEventsExport()
}

const setDragoniteCost = value => {
	dragoniteCost = parseInt(value)
	calculateGemsBalance()
	weeklyEventsExport()
}

const calculateUnderspireCost = value => {
	switch (parseInt(value)) {
		case 0:
			underspireCost = 0
			break
		case 1:
			underspireCost = 350
			break
		case 2:
			underspireCost = 1050
			break
		case 3:
			underspireCost = 2100
			break
		default:
			console.log('coś nie pykło')
			return
	}
	calculateGemsBalance()
	weeklyEventsExport()
}

const calculateEpicTrialCost = value => {
	epicTrialCost = value * 200
	calculateGemsBalance()
	weeklyEventsExport()
}

const calculateFactionCost = tier => {
	switch (parseInt(tier)) {
		case 0:
			factionCost = 0
			break
		case 1:
			factionCost = 30
			break
		case 2:
			factionCost = 90
			break
		case 3:
			factionCost = 210
			break
		case 4:
			factionCost = 410
			break
		case 5:
			factionCost = 710
			break
		case 6:
			factionCost = 1110
			break
		case 7:
			factionCost = 1310
			break
		case 8:
			factionCost = 1510
			break
		case 9:
			factionCost = 1810
			break
		case 10:
			factionCost = 2010
			break
		case 11:
			factionCost = 2210
			break
		default:
			console.log('coś nie pykło')
			return
	}
	calculateGemsBalance()
	weeklyEventsExport()
}

const calculatePetRescueCost = tier => {
	switch (parseInt(tier)) {
		case 0:
			petRescueCost = 0
			break
		case 1:
			petRescueCost = 25
			break
		case 2:
			petRescueCost = 75
			break
		case 3:
			petRescueCost = 175
			break
		case 4:
			petRescueCost = 375
			break
		case 5:
			petRescueCost = 675
			break
		case 6:
			petRescueCost = 1075
			break
		case 7:
			petRescueCost = 1175
			break
		case 8:
			petRescueCost = 1275
			break
		case 9:
			petRescueCost = 1375
			break
		case 10:
			petRescueCost = 1475
			break
		case 11:
			petRescueCost = 1575
			break
		default:
			console.log('coś nie pykło')
			return
	}
	calculateGemsBalance()
	weeklyEventsExport()
}

const calculateClassCost = tier => {
	switch (parseInt(tier)) {
		case 0:
			classCost = 0
			break
		case 1:
			classCost = 30
			break
		case 2:
			classCost = 100
			break
		case 3:
			classCost = 250
			break
		case 4:
			classCost = 500
			break
		case 5:
			classCost = 850
			break
		case 6:
			classCost = 1350
			break
		case 7:
			classCost = 1850
			break
		case 8:
			classCost = 2350
			break
		case 9:
			classCost = 2850
			break
		case 10:
			classCost = 3350
			break
		case 11:
			classCost = 3850
			break
		default:
			console.log('coś nie pykło')
			return
	}
	calculateGemsBalance()
	weeklyEventsExport()
}

const weeklyEventsExport = () => {
	localStorage.setItem('weeklyEventSelect', weeklyEventSelect.value)
	localStorage.setItem('weeklyEventTierSelect', weeklyEventTierSelect.value)
	localStorage.setItem('weeklyEventTotalCostAmount', weeklyEventTotalCostAmount.textContent)
	localStorage.setItem('gemBountyInput', gemBountyInput.value)
	localStorage.setItem('dragoniteInput', dragoniteInput.value)
	localStorage.setItem('underspireSelect', underspireSelect.value)
	localStorage.setItem('epicTrialSelect', epicTrialSelect.value)
	localStorage.setItem('factionSelect', factionSelect.value)
	localStorage.setItem('petRescueSelect', petRescueSelect.value)
	localStorage.setItem('classSelect', classSelect.value)
}

// ===== WEEKEND =====

const weekendEventSelect = document.querySelector('.gem-managment__weekend-event-select')
const weekendEventTierSelect = document.querySelector('.gem-managment__weekend-event-tier-select')
const weekendEventTotalCostAmount = document.querySelector('.gem-managment__weekend-event-total-cost-amount')
let totalWeekendEventCost = 0
let currentWeekendEvent = 0
let factionExpansionCost = 0
let bountyCost = 0

const setWeekendEvent = value => {
	if (value == 1 || value == 2) {
		weekendEventTierSelect.disabled = true
		weekendEventTierSelect.style.opacity = '0.5'
		weekendEventTotalCostAmount.textContent = '0'
		factionExpansionCost = 0
		bountyCost = 0
		calculateGemsBalance()
	} else if (value == 3) {
		currentWeekendEvent = 'bounty'
		weekendEventTierSelect.disabled = false
		weekendEventTierSelect.style.opacity = '1'
		weekendEventTierSelect.value = 0
		factionExpansionCost = 0
		calculateGemsBalance()
	} else {
		currentWeekendEvent = 'faction expansion'
		weekendEventTierSelect.disabled = false
		weekendEventTierSelect.style.opacity = '1'
		weekendEventTierSelect.value = 0
		calculateGemsBalance()
	}
	weekendEventExport()
}

const calculateTotalWeekendEventCost = tier => {
	if (currentWeekendEvent == 'bounty') {
		switch (parseInt(tier)) {
			case 0:
				bountyCost = 0
				break
			case 1:
				bountyCost = 30
				break
			case 2:
				bountyCost = 100
				break
			case 3:
				bountyCost = 250
				break
			case 4:
				bountyCost = 500
				break
			case 5:
				bountyCost = 850
				break
			case 6:
				bountyCost = 1350
				break
			case 7:
				bountyCost = 1850
				break
			case 8:
				bountyCost = 2350
				break
			case 9:
				bountyCost = 2850
				break
			case 10:
				bountyCost = 3350
				break
			case 11:
				bountyCost = 3850
				break
			default:
				console.log('coś nie pykło')
				return
		}
	} else if (currentWeekendEvent == 'faction expansion') {
		switch (parseInt(tier)) {
			case 0:
				factionExpansionCost = 0
				break
			case 1:
				factionExpansionCost = 30
				break
			case 2:
				factionExpansionCost = 90
				break
			case 3:
				factionExpansionCost = 210
				break
			case 4:
				factionExpansionCost = 410
				break
			case 5:
				factionExpansionCost = 710
				break
			case 6:
				factionExpansionCost = 1110
				break
			case 7:
				factionExpansionCost = 1310
				break
			case 8:
				factionExpansionCost = 1510
				break
			case 9:
				factionExpansionCost = 1810
				break
			case 10:
				factionExpansionCost = 2010
				break
			case 11:
				factionExpansionCost = 2210
				break
			default:
				console.log('coś nie pykło')
				return
		}
	}
	weekendEventTotalCostAmount.textContent = factionExpansionCost + bountyCost
	calculateGemsBalance()
	weekendEventExport()
}

const weekendEventExport = () => {
	localStorage.setItem('weekendEventSelect', weekendEventSelect.value)
	localStorage.setItem('weekendEventTierSelect', weekendEventTierSelect.value)
	localStorage.setItem('weekendEventTotalCostAmount', weekendEventTotalCostAmount.textContent)
}

// ===== GUILD WARS =====

const guildWarsSelect = document.querySelector('.gem-managment__guild-wars-select')
const guildWarsSentinelsSelect = document.querySelector('.gem-managment__guild-wars-sentinels-select')
const guildWarsTotalCostAmount = document.querySelector('.gem-managment__guild-wars-total-cost-amount')
let guildWarsCost = 0

const setGuildWars = value => {
	if (value == 2) {
		guildWarsSentinelsSelect.disabled = true
		guildWarsSentinelsSelect.style.opacity = '0.5'
		guildWarsTotalCostAmount.textContent = '0'
		guildWarsCost = 0
		calculateGuildWarsCost()
	} else if (value == 1) {
		guildWarsSentinelsSelect.disabled = false
		guildWarsSentinelsSelect.style.opacity = '1'
		guildWarsSentinelsSelect.value = 0
		calculateGuildWarsCost()
	}
	guildWarsExport()
}

const calculateGuildWarsCost = tier => {
	if (tier < 3) {
		guildWarsCost = 0
	} else if (tier == 3) {
		guildWarsCost = 40
	} else if (tier == 4) {
		guildWarsCost = 100
	} else if (tier == 5) {
		guildWarsCost = 200
	} else {
		guildWarsCost = 0
	}

	guildWarsTotalCostAmount.textContent = guildWarsCost
	calculateGemsBalance()
	guildWarsExport()
}

const guildWarsExport = () => {
	localStorage.setItem('guildWarsSelect', guildWarsSelect.value)
	localStorage.setItem('guildWarsSentinelsSelect', guildWarsSentinelsSelect.value)
	localStorage.setItem('guildWarsTotalCostAmount', guildWarsTotalCostAmount.textContent)
}
// ===== ADDITIONAL EXPENSES =====

const expenseInputSource = document.querySelector('.gem-managment__additional-expenses-input-area-source')
const expenseInputAmount = document.querySelector('.gem-managment__additional-expenses-input-area-input')
const addExpenseBtn = document.querySelector('.gem-managment__additional-expenses-input-area-add-btn')

const allAdditionalExpenses = document.querySelector('.gem-managment__additional-expenses-items')
const additionalExpensesItemBox = document.querySelector('.gem-managment__additional-expenses-item')
let newExpenceItem
const expenseName = document.querySelector('.gem-managment__additional-expenses-item-name')
const expenseAmount = document.querySelector('.gem-managment__additional-expenses-item-amount')
const expenseEditBtn = document.querySelector('.gem-managment__additional-expenses-item-edit-btn')
const expenseDeleteBtn = document.querySelector('.gem-managment__additional-expenses-item-delete-btn')
let id = 1
let itemToDelete
let expensesIncomesSummary
let expensesIncomesSummary2

const addExpense = () => {
	newExpenceItem = document.createElement('div')
	newExpenceItem.classList.add('gem-managment__additional-expenses-item')
	newExpenceItem.setAttribute('id', id)
	newExpenceItem.innerHTML = `
	<img class="label-icon--small" src="https://www.taransworld.com/GoW_graphics/Game/Chat_Emojis_elementfire.png" alt="star">
    <p class="gem-managment__additional-expenses-item-name">${expenseInputSource.value}</p>
    <span class="gem-managment__additional-expenses-item-amount">${expenseInputAmount.value}</span>
    <div class="gem-managment__buttons-box">
    	<button class="gem-managment__additional-expenses-item-delete-btn" onclick="deleteItem(${id})">
		<i class="fa-regular fa-trash-can"></i></button>
    </div>
`

	// <button class="gem-managment__additional-expenses-item-edit-btn">
	// <i class="fa-regular fa-pen-to-square"></i></button>  --- wersja bez edit

	id++
	allAdditionalExpenses.append(newExpenceItem)
	manageExpensesIncomesSummary()
	expenseInputSource.value = null
	expenseInputAmount.value = null
}

const deleteItem = id => {
	itemToDelete = document.getElementById(id)
	itemToDelete.remove()
	manageExpensesIncomesSummary()
}

const additionalExpensesExport = () => {
	localStorage.setItem('allAdditionalExpenses', allAdditionalExpenses.innerHTML)
}

// ===== ADDITIONAL INCOMES =====

const incomeInputSource = document.querySelector('.gem-managment__additional-incomes-input-area-source')
const incomeInputAmount = document.querySelector('.gem-managment__additional-incomes-input-area-input')
const addIncomeBtn = document.querySelector('.gem-managment__additional-incomes-input-area-add-btn')

const allAdditionalIncomes = document.querySelector('.gem-managment__additional-incomes-items')
const additionalIncomesItemBox = document.querySelector('.gem-managment__additional-incomes-item')
let newIncomeItem
const incomeName = document.querySelector('.gem-managment__additional-incomes-item-name')
const incomeAmount = document.querySelector('.gem-managment__additional-incomes-item-amount')
const incomeEditBtn = document.querySelector('.gem-managment__additional-incomes-item-edit-btn')
const incomeDeleteBtn = document.querySelector('.gem-managment__additional-incomes-item-delete-btn')

const addIncome = () => {
	newIncomeItem = document.createElement('div')
	newIncomeItem.classList.add('gem-managment__additional-incomes-item')
	newIncomeItem.setAttribute('id', id)
	newIncomeItem.innerHTML = `
	<img class="label-icon--small" src="https://www.taransworld.com/GoW_graphics/Game/Chat_Emojis_elementnature.png" alt="star">
    <p class="gem-managment__additional-incomes-item-name">${incomeInputSource.value}</p>
    <span class="gem-managment__additional-incomes-item-amount">${incomeInputAmount.value}</span>
    <div class="gem-managment__buttons-box">
    	<button class="gem-managment__additional-incomes-item-delete-btn" onclick="deleteItem(${id})">
		<i class="fa-regular fa-trash-can"></i></button>
    </div>
`
	id++
	allAdditionalIncomes.append(newIncomeItem)
	manageExpensesIncomesSummary()
	incomeInputSource.value = null
	incomeInputAmount.value = null
}

const manageExpensesIncomesSummary = () => {
	let expensesSummary = document.getElementsByClassName('gem-managment__additional-expenses-item-amount')
	let incomesSummary = document.getElementsByClassName('gem-managment__additional-incomes-item-amount')
	let expensesIncomesSummary = 0

	// console.log(expensesSummary)
	// console.log(incomesSummary)

	for (const el of expensesSummary) {
		expensesIncomesSummary -= parseInt(el.textContent)
	}

	for (const el of incomesSummary) {
		expensesIncomesSummary += parseInt(el.textContent)
	}

	expensesIncomesSummary2 = expensesIncomesSummary
	calculateGemsBalance()
	additionalIncomesExport()
	additionalExpensesExport()
}

const additionalIncomesExport = () => {
	localStorage.setItem('allAdditionalIncomes', allAdditionalIncomes.innerHTML)
}

// ===== BALANCE =====

const gemBalanceAmount = document.querySelector('.gem-managment__gem-balance-amount')
const sunglassesIcon = document.querySelector('.gem-managment__sunglasses-icon')
const fearIcon = document.querySelector('.gem-managment__fear-icon')
let gemsBalance

const manageBalanceIcon = gemsBalance => {
	if (gemsBalance >= 0) {
		sunglassesIcon.style.display = 'block'
		fearIcon.style.display = 'none'
	} else {
		fearIcon.style.display = 'block'
		sunglassesIcon.style.display = 'none'
	}
}

const calculateGemsBalance = () => {
	gemBountyInput.value == '' ? (gemBountyInput.value = 0) : null
	dragoniteInput.value == '' ? (dragoniteInput.value = 0) : null
	expensesIncomesSummary2 == undefined ? (expensesIncomesSummary2 = 0) : null

	gemsBalance =
		7 * parseInt(averageGemsPerDaySpan.textContent) -
		(totalWeeklyEventCost +
			gemBountyCost +
			dragoniteCost +
			underspireCost +
			epicTrialCost +
			factionCost +
			petRescueCost +
			classCost +
			factionExpansionCost +
			bountyCost +
			guildWarsCost) +
		expensesIncomesSummary2

	gemBalanceAmount.textContent = gemsBalance
	// expensesIncomesSummary = 0

	manageBalanceIcon(gemsBalance)
}
//  ==================

document.addEventListener('DOMContentLoaded', function () {
	allClassLevelInputs.forEach(input => {
		lastClassClass = input.classList[input.classList.length - 1]
		// Pobierz dane z Local Storage
		storedValue = localStorage.getItem(lastClassClass)
		// Aktualizuj wartość inputu, jeśli dane są dostępne
		if (storedValue !== null) {
			input.value = storedValue
		}
	})

	allKingdomLevelInputs.forEach(input => {
		lastKingdomClass = input.classList[input.classList.length - 1]
		storedValue = localStorage.getItem(lastKingdomClass)
		if (storedValue !== null) {
			input.value = storedValue
		}
	})

	const tributesDailyInputImport = () => {
		storedValue = localStorage.getItem('tributesCollectedDaily')
		if (storedValue !== null) {
			tributesDailyInput.value = storedValue
		}
		storedValue = localStorage.getItem('averageGemsPerTributeSpan')
		if (storedValue !== null) {
			averageGemsPerTributeSpan.textContent = storedValue
		}
		storedValue = localStorage.getItem('averageGemsPerDaySpan')
		if (storedValue !== null) {
			averageGemsPerDaySpan.textContent = storedValue
		}
	}

	const weeklyEventsImport = () => {
		weeklyEventSelect.value = localStorage.getItem('weeklyEventSelect')
		weeklyEventTierSelect.value = localStorage.getItem('weeklyEventTierSelect')
		weeklyEventTotalCostAmount.textContent = localStorage.getItem('weeklyEventTotalCostAmount')
		gemBountyInput.value = localStorage.getItem('gemBountyInput')
		dragoniteInput.value = localStorage.getItem('dragoniteInput')
		underspireSelect.value = localStorage.getItem('underspireSelect')
		epicTrialSelect.value = localStorage.getItem('epicTrialSelect')
		factionSelect.value = localStorage.getItem('factionSelect')
		petRescueSelect.value = localStorage.getItem('petRescueSelect')
		classSelect.value = localStorage.getItem('classSelect')
	}

	const weekendEventImport = () => {
		weekendEventSelect.value = localStorage.getItem('weekendEventSelect')
		weekendEventTierSelect.value = localStorage.getItem('weekendEventTierSelect')
		weekendEventTotalCostAmount.textContent = localStorage.getItem('weekendEventTotalCostAmount')
	}

	const guildWarsImport = () => {
		guildWarsSelect.value = localStorage.getItem('guildWarsSelect')
		guildWarsSentinelsSelect.value = localStorage.getItem('guildWarsSentinelsSelect')
		guildWarsTotalCostAmount.textContent = localStorage.getItem('guildWarsTotalCostAmount')
	}

	const additionalExpensesImport = () => {
		allAdditionalExpenses.innerHTML = localStorage.getItem('allAdditionalExpenses')
	}

	additionalIncomesImport = () => {
		allAdditionalIncomes.innerHTML = localStorage.getItem('allAdditionalIncomes')
	}

	tributesDailyInputImport()
	weeklyEventsImport()
	weekendEventImport()
	guildWarsImport()
	additionalExpensesImport()
	additionalIncomesImport()

	handleTabs()
	handlePlayerDataBodies()
	createKingdomPowerLevelObj()

	setWeekendEvent(weekendEventSelect.value)
	calculateGuildWarsCost(guildWarsSentinelsSelect.value)
	calculateGemsBalance()
})

// localStorage.setItem('guildWarsSelect', guildWarsSelect.value)
// localStorage.setItem('guildWarsSentinelsSelect', guildWarsSentinelsSelect.value)
// localStorage.setItem('guildWarsTotalCostAmount', guildWarsTotalCostAmount.textContent)

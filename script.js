const containers = document.querySelectorAll('.container')
let firstTable = []
let secondTable = []
let resultTable = []

const allCanvas = document.querySelectorAll('canvas')

const createCanvas = (ctx, canvas) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'black'
    ctx.lineWidth = 1.0
    ctx.beginPath()

    ctx.moveTo(1200, 20)
    ctx.lineTo(20, 20)
    ctx.lineTo(20, 600)
    ctx.stroke()

    for (let i = 0; i < 6; i++) {
        ctx.fillText(i * 50, 25 + i * 42, 10)
        ctx.fillText(i * 50 + '', 4, i * 42 + 30)
        ctx.stroke()
    }
}

allCanvas.forEach(el => {
    const ctx = el.getContext('2d')
    ctx.translate(0, el.height)
    ctx.rotate(-Math.PI / 2)
    createCanvas(ctx, el)
})

const createElem = (tagName, className, text) => {
    const elem = document.createElement(tagName);
    elem.classList.add(className);
    if (text) {
        elem.textContent = text
    }
    return elem
}

const renderTable = () => {
    containers.forEach((container, i) => {
        const table = createElem('table', 'table');
        table.classList.add(`table${i}`)
        const btnAdd = createElem('button', 'btnAdd', 'Add');
        const row = createElem('tr')
        const X = createElem('th', 'titleX', 'X');
        const Y = createElem('th', 'titleY', 'Y');

        container.append(table)
        table.append(row)
        row.append(X)
        row.append(Y)
        container.append(btnAdd)
    })
}

renderTable()

const writeChart = (table, ctx, canvas) => {
    createCanvas(ctx, canvas)
    ctx.fillStyle = 'black'
    ctx.lineWidth = 1.0
    ctx.beginPath()
    ctx.moveTo(20, 20)

    table.forEach((res, i) => {
        ctx.lineTo(+res.x + 20, +res.y + 20)
        ctx.fillText(`X: ${res.x}, Y: ${res.y}`, res.x,  res.y)
    })
    ctx.stroke()
}

const setResult = () => {
    const tableResult = document.querySelector('.result').querySelector('table')
    while (tableResult.firstChild) {
        tableResult.removeChild(tableResult.firstChild)
    }
    resultTable = []
    let minimum = firstTable.length > secondTable.length ? secondTable : firstTable
    minimum.forEach((elem, i) => {
        const row = createElem('tr', 'row');
        const tdX = createElem('td');
        const tdY = createElem('td');
        const tdDelete = createElem('td');
        const X = createElem('input', 'fieldX');
        const Y = createElem('input', 'fieldY');

        X.value = (+firstTable[i].x + +secondTable[i].x) / 2
        Y.value = (+firstTable[i].y + +secondTable[i].y) / 2

        resultTable.push({x: X.value, y: Y.value})

        tableResult.append(row)
        row.append(tdX)
        row.append(tdY)
        row.append(tdDelete)
        tdX.append(X)
        tdY.append(Y)
    })
}

const completion = (table, className) => {
    const fieldX = document.querySelector(className).querySelectorAll('.fieldX')
    const fieldY = document.querySelector(className).querySelectorAll('.fieldY')
    const valuesOfY = []
    const valuesOfX = []
    fieldY.forEach(y => {
        valuesOfY.push(y.value)
    })
    fieldX.forEach(x => {
        valuesOfX.push(x.value)
    })
    for (let i = 0; i < valuesOfX.length; i++) {
        table.push({x: valuesOfX[i], y: valuesOfY[i]})
    }
}

const calculateResultEvent = (e) => {
    const classes = ['.table0', '.table1']
    classes.forEach(cls => {
        if (cls === '.table0') {
            firstTable = []
            completion(firstTable, cls) 
        }
        if (cls === '.table1') {
            secondTable = []
            completion(secondTable, cls) 
        }
    })
    setResult()

    allCanvas.forEach((el, i) => {
        const ctx = el.getContext('2d')
        const arrays = [firstTable, secondTable, resultTable]
        writeChart(arrays[i], ctx, el)
    })  
}

const calculateResult = () => {  
    const btnCalculate = document.querySelector('.btnCalculate')
    btnCalculate.removeEventListener('click', calculateResultEvent)
    btnCalculate.addEventListener('click', calculateResultEvent)  
}

const deleteRowEvent = (e) => {
    e.preventDefault()
    let closestrow = e.target.closest('.row')
    closestrow.remove()
}

const deleteRow = () => {
    const btnsDelete = document.querySelectorAll('.btnDelete')
    btnsDelete.forEach(btn => {
        btn.removeEventListener('click', deleteRowEvent)
        btn.addEventListener('click', deleteRowEvent)
    }) 
}

const addNewRow = () => {
    const btnAdd = document.querySelectorAll('.btnAdd')
    btnAdd.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault()
            let closestTable = e.target.closest('.container').querySelector('table');
            const row = createElem('tr', 'row');
            const tdX = createElem('td');
            const tdY = createElem('td');
            const tdDelete = createElem('td');
            const X = createElem('input', 'fieldX');
            const Y = createElem('input', 'fieldY');
            const btnDelete = createElem('button', 'btnDelete', 'Delete');

            closestTable.append(row)
            row.append(tdX)
            row.append(tdY)
            row.append(tdDelete)
            tdX.append(X)
            tdY.append(Y)
            tdDelete.append(btnDelete)
            deleteRow()
            calculateResult()
        })
    })
}

addNewRow()

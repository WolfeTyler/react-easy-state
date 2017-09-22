import { easyStore } from 'react-easy-state'
import randomSentence from './randomSentence'

let idCounter = 1

export default easyStore({
  rows: [],
  deselectAll () {
    if (this.selectedRow) {
      this.selectedRow.selected = false
      this.selectedRow = undefined
    }
  },
  buildRows (numOfRows) {
    for (let i = 0; i < numOfRows; i++) {
      this.rows.push({ id: idCounter++, label: randomSentence() })
    }
    this.deselectAll()
  },
  run () {
    this.rows = []
    this.buildRows(1000)
  },
  add () {
    this.buildRows(1000)
  },
  update () {
    for (let i = 0; i < this.rows.length; i += 10) {
      this.rows[i].label += ' !!!'
    }
  },
  select (row) {
    this.deselectAll()
    this.selectedRow = row
    row.selected = true
  },
  delete (row) {
    this.rows.splice(this.rows.indexOf(row), 1)
  },
  runLots () {
    this.rows = []
    this.buildRows(10000)
  },
  clear () {
    this.rows = []
  },
  swapRows () {
    if (this.rows.length > 10) {
      const temp = this.rows[4]
      this.rows[4] = this.rows[9]
      this.rows[9] = temp
    }
  }
})

require('dotenv').config()
const EMPTY_PLACEHOLDER = process.env.DATABASE_EMPTY_VALUE_PLACEHOLDER;

class CsvQuery {
  constructor(rows, csvLookupInstance) {
    this.rows = rows;
    this.csvLookupInstance = csvLookupInstance;
  }

  update(updates) {
    this.rows.forEach(row => {
      Object.keys(updates).forEach(updateKey => {
        let value = updates[updateKey];
        if (value === '') {
          value = EMPTY_PLACEHOLDER;
        }
        this.csvLookupInstance.updateNestedField(row, updateKey, value);
      });
    });
    return this;
  }

  delete() {
    this.csvLookupInstance.deleteRows(this.rows);
    return this;
  }

  getAll() {
    return this.rows.map(row => this.transformRow(row));
  }

  toJSON() {
    return this.rows.map(row => this.csvLookupInstance.toSerializableObject(this.transformRow(row)));
  }

  random() {
    if (this.rows.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * this.rows.length);
    return this.transformRow(this.rows[randomIndex]);
  }

  sort(field, order = 'asc') {
    const compare = (a, b) => {
      const aValue = this.csvLookupInstance.getNestedValue(a, field);
      const bValue = this.csvLookupInstance.getNestedValue(b, field);

      if (aValue < bValue) {
        return order === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return order === 'asc' ? 1 : -1;
      }
      return 0;
    };

    this.rows.sort(compare);
    return this;
  }

  toJSONCompact() {
    return JSON.stringify(this.toJSON(), (key, value) => {
      if (typeof value === 'bigint') {
        return value.toString() + 'n';
      }
      return value;
    });
  }

  transformRow(row) {
    // Replace the EMPTY_PLACEHOLDER with an empty string in the output
    const newRow = {};
    Object.keys(row).forEach(key => {
      let value = row[key];
      if (value === EMPTY_PLACEHOLDER) {
        value = '';
      }
      newRow[key] = value;
    });
    return newRow;
  }
}

module.exports = CsvQuery;

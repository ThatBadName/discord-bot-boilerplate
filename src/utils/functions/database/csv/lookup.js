const fs = require("fs");
require("dotenv").config();
const CsvQuery = require("./query");
const AsyncFileHandler = require("../../../classes/FileHandler");
const EMPTY_PLACEHOLDER = process.env.DATABASE_EMPTY_VALUE_PLACEHOLDER;
const DOUBLE_QUOTES_PLACEHOLDER = process.env.DATABASE_DOUBLE_QUOTES_PLACEHOLDER;

class CsvLookup {
  constructor(csvContent) {
    this.parseCsv(csvContent);
  }

  parseCsv(csvContent) {
    const lines = csvContent.trim().split("\n");
    this.headers = this.splitCsvLine(lines[0]);
    this.typeMap = {};
    this.rows = lines.slice(1).map(line => {
      const values = this.splitCsvLine(line);
      return this.headers.reduce((acc, header, index) => {
        const parsedValue = this.parseValue(values[index], header);
        this.setNestedValue(acc, header, parsedValue);
        return acc;
      }, {});
    });
  }

  splitCsvLine(line) {
    const values = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      if (line[i] === '"' && (i === 0 || line[i - 1] !== "\\")) {
        inQuotes = !inQuotes;
      } else if (line[i] === "," && !inQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += line[i];
      }
    }
    values.push(current.trim());
    return values.map(value => value.replace(/^"|"$/g, "").replace(/\\"/g, '"'));
  }

  parseValue(value, header) {
    let parsedValue;
    try {
      if (value === EMPTY_PLACEHOLDER) {
        parsedValue = "";
      } else if (value.startsWith("{") || value.startsWith("[")) {
        parsedValue = JSON.parse(value);
      } else if (/^\d+n$/.test(value)) {
        parsedValue = BigInt(value.slice(0, -1));
      } else if (/^\d+$/.test(value) && !Number.isSafeInteger(Number(value))) {
        parsedValue = BigInt(value);
      } else {
        parsedValue = value;
      }
    } catch (e) {
      parsedValue = value;
    }
    this.typeMap[header] = typeof parsedValue;
    return parsedValue;
  }

  setNestedValue(obj, key, value) {
    const keys = key.split(".");
    keys.reduce((acc, currentKey, index) => {
      if (index === keys.length - 1) {
        acc[currentKey] = value;
      } else {
        if (!acc[currentKey]) {
          acc[currentKey] = {};
        }
        acc = acc[currentKey];
      }
      return acc;
    }, obj);
  }

  where(conditions = {}, limit) {
    let filteredRows = this.rows.filter(row => {
      return Object.keys(conditions).every(key => {
        const value = this.getNestedValue(row, key);
        const conditionValue = conditions[key];

        if (Array.isArray(conditionValue)) {
          return conditionValue.includes(value);
        }
        return value !== undefined && value !== null && value == conditionValue;
      });
    });

    if (limit !== undefined) {
      filteredRows = filteredRows.slice(0, limit);
    }

    return new CsvQuery(filteredRows, this);
  }

  deleteRows(rowsToDelete) {
    this.rows = this.rows.filter(row => !rowsToDelete.includes(row));
  }

  create(newRecord) {
    const newRow = {};
    Object.keys(newRecord).forEach(key => {
      const value = newRecord[key];
      this.setNestedValue(newRow, key, value);
    });
    this.rows.push(newRow);
  }

  updateNestedField(row, key, value) {
    this.setNestedValue(row, key, value);
  }

  toCsv() {
    const csvLines = [this.headers.join(",")];
    this.rows.forEach(row => {
      const lineValues = this.headers.map(header => {
        let value = this.getNestedValue(row, header);
        if (typeof value === "bigint") {
          value = value.toString();
        } else if (typeof value === "object") {
          value = JSON.stringify(value);
        }
        if (value === "") {
          value = EMPTY_PLACEHOLDER;
        }
        if (typeof value === "string" && value.includes(",")) {
          value = `"${value.replace(/"/g, `${DOUBLE_QUOTES_PLACEHOLDER}`)}"`;
        }
        return value;
      });
      csvLines.push(lineValues.join(","));
    });
    return csvLines.join("\n");
  }

  async saveToFile(filename) {
    await AsyncFileHandler.write(filename, this.toCsv());
  }

  getNestedValue(obj, key) {
    return key.split(".").reduce((acc, currentKey) => {
      if (acc && acc.hasOwnProperty(currentKey)) {
        return acc[currentKey];
      } else {
        return undefined;
      }
    }, obj);
  }

  random() {
    if (this.rows.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * this.rows.length);
    return this.rows[randomIndex];
  }

  sort(field, order = "asc") {
    const compare = (a, b) => {
      const aValue = this.getNestedValue(a, field);
      const bValue = this.getNestedValue(b, field);

      if (aValue < bValue) {
        return order === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return order === "asc" ? 1 : -1;
      }
      return 0;
    };

    this.rows.sort(compare);
    return this;
  }

  toJSON() {
    return this.rows.map(row => this.toSerializableObject(row));
  }

  toSerializableObject(obj) {
    if (Array.isArray(obj)) {
      return obj.map(item => this.toSerializableObject(item));
    } else if (obj !== null && typeof obj === "object") {
      const serializedObj = {};
      Object.keys(obj).forEach(key => {
        if (typeof obj[key] === "bigint") {
          serializedObj[key] = obj[key].toString();
        } else if (typeof obj[key] === "object") {
          serializedObj[key] = this.toSerializableObject(obj[key]);
        } else if (typeof obj[key] === "boolean") {
          serializedObj[key] = obj[key];
        } else if (typeof obj[key] === "string") {
          if (obj[key].startsWith("{") || obj[key].startsWith("[")) {
            serializedObj[key] = JSON.parse(obj[key].replaceAll(DOUBLE_QUOTES_PLACEHOLDER, '"').replaceAll(EMPTY_PLACEHOLDER, '""'));
          } else if (["true", "false"].includes(obj[key])) {
            serializedObj[key] = obj[key] == "true";
          } else if (obj[key] == "null") {
            serializedObj[key] = null;
          } else {
            serializedObj[key] = obj[key];
          }
        } else {
          serializedObj[key] = obj[key];
        }
      });
      return serializedObj;
    }
    return obj;
  }
}

function isBigInt(value) {
  try {
    return BigInt(parseInt(value, 10)) !== BigInt(value);
  } catch (e) {
    return false;
  }
}

module.exports = CsvLookup;

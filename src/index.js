import XLSX from 'xlsx';

const data = XLSX.readFile('./src/Data.xlsx');

const isInclude = (liter, terminals) => {
  const terms = terminals.split(" ")
  return !!terms.find(value => value === liter)
}

const getDataFromXlsx = (column, row) => {
  const NAMES = {
    'Terminals': "A",
    "Next": "B",
    "Accept": "C",
    "Stack": "D",
    "Return": "E",
    "Error": "F",
  }

  const c = NAMES[column];
  const r = row + 2;
  return data.Sheets['Лист1'][`${c}${r}`].v;
}

const LL1_analyzer = (string) => {
  let i = 0
  let stack = [0]
  let accept = true
  let liters = string.split(" ")
  let n = 0
  let liter;

  while (i !== 0 || n < liters.length) {
    if (accept) {
      liter = liters[n];
      n++;
    }
    if (isInclude(liter, getDataFromXlsx("Terminals", i))) {
      accept = !!getDataFromXlsx("Accept", i);
      if (getDataFromXlsx("Return", i)) {
        i = stack.pop();
      } else {
        if (getDataFromXlsx('Stack', i)) {
          stack.push(i + 1);
        }
        i = getDataFromXlsx('Next', i) - 1;
      }
    }
    else {
      if (getDataFromXlsx('Error', i)) {
        console.log(`Слово "${string}" не принадлежит алфавиту`);
        return;
      }
      else {
        i += 1;
        accept = false;
      }
    }
  }
  console.log(`Слово "${string}" принадлежит алфавиту`);
}

LL1_analyzer('float id( float id , float id ) ;');

LL1_analyzer('float id( , float id ) ;');

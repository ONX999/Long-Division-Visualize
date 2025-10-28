// Long Division Algorithm
function longDivisionSteps(dividend, divisor){
  dividend = String(Math.floor(Math.abs(Number(dividend))));
  divisor = Number(Math.floor(Math.abs(Number(divisor))));
  if(divisor === 0) throw new Error('除數不能為 0');
  if(dividend === "0") return { quotient: "0", remainder: 0, steps: [] };
  const digits = dividend.split('').map(d => Number(d));
  let current = 0;
  let quotientDigits = [];
  let steps = [];
  for(let i=0;i<digits.length;i++){
    current = current*10 + digits[i];
    if(current < divisor){
      quotientDigits.push(0);
      steps.push({index:i, partial: current, subtract: 0, quotientDigit: 0, remainderAfter: current, note: '不足以除，商位為0'});
    } else {
      const qd = Math.floor(current / divisor);
      const sub = qd * divisor;
      const remainderAfter = current - sub;
      quotientDigits.push(qd);
      steps.push({index:i, partial: current, subtract: sub, quotientDigit: qd, remainderAfter: remainderAfter, note: `除得 ${qd}，減去 ${sub}，餘 ${remainderAfter}`});
      current = remainderAfter;
    }
  }
  let qStr = quotientDigits.join('').replace(/^0+(?=\d)/,'');
  if(qStr === '') qStr = '0';
  return { quotient: qStr, remainder: current, steps };
}

// Multiplication Algorithm
function multiplicationSteps(num1, num2){
  num1 = String(Math.floor(Math.abs(Number(num1))));
  num2 = String(Math.floor(Math.abs(Number(num2))));
  const n1 = Number(num1);
  const n2 = Number(num2);
  const product = n1 * n2;
  
  const digits2 = num2.split('').reverse();
  let steps = [];
  let partialProducts = [];
  
  for(let i = 0; i < digits2.length; i++){
    const digit = Number(digits2[i]);
    const partial = n1 * digit;
    const shifted = partial * Math.pow(10, i);
    partialProducts.push(shifted);
    steps.push({
      index: i,
      digit: digit,
      position: i,
      partial: partial,
      shifted: shifted,
      note: `${num1} × ${digit} = ${partial}${i > 0 ? ` (位移 ${i} 位 = ${shifted})` : ''}`
    });
  }
  
  return { product: String(product), partialProducts, steps };
}

// Render ASCII Division
function renderAsciiDivision(dividend, divisor, result){
  const left = String(divisor);
  const right = String(dividend);
  const q = String(result.quotient);
  const bar = left + ' ) ' + right + '\n' +
              ' '.repeat(left.length+3) + '-'.repeat(Math.max(right.length, q.length)) + '\n' +
              ' '.repeat(left.length+3) + q;
  let stepLines = [];
  result.steps.forEach((s, idx) => {
    if(s.subtract > 0){
      stepLines.push(`步驟 ${idx+1}: 部分=${s.partial} 減去=${s.subtract} 餘數=${s.remainderAfter}`);
    } else {
      stepLines.push(`步驟 ${idx+1}: 部分=${s.partial} (不足以除)`);
    }
  });
  return bar + '\n\n' + stepLines.join('\n');
}

// Render ASCII Multiplication
function renderAsciiMultiplication(num1, num2, result){
  const lines = [];
  lines.push(`  ${num1}`);
  lines.push(`× ${num2}`);
  lines.push('-'.repeat(Math.max(num1.length, num2.length) + 2));
  
  result.steps.forEach((s, idx) => {
    const spacing = ' '.repeat(idx);
    lines.push(spacing + String(s.partial));
  });
  
  if(result.steps.length > 1){
    lines.push('-'.repeat(Math.max(num1.length, num2.length) + 2));
  }
  lines.push(String(result.product));
  
  return lines.join('\n');
}

// Calculator State
let currentOperation = 'division'; // 'division' or 'multiplication'
let activeInput = 'input1'; // 'input1' or 'input2'
let input1Value = '';
let input2Value = '';

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const divisionBtn = document.getElementById('divisionBtn');
  const multiplicationBtn = document.getElementById('multiplicationBtn');
  const input1 = document.getElementById('input1');
  const input2 = document.getElementById('input2');
  const label1 = document.getElementById('label1');
  const label2 = document.getElementById('label2');
  const operatorSymbol = document.getElementById('operatorSymbol');
  const calcBtn = document.getElementById('calcBtn');
  const clearBtn = document.getElementById('clearBtn');
  const deleteBtn = document.getElementById('deleteBtn');
  const switchInput = document.getElementById('switchInput');
  const resultPanel = document.getElementById('resultPanel');
  const ascii = document.getElementById('asciiDivision');
  const stepsList = document.getElementById('steps');
  const summary = document.getElementById('summary');
  const numBtns = document.querySelectorAll('.num-btn');

  // Update active input styling
  function updateInputFocus(){
    input1.style.background = activeInput === 'input1' ? '#f0f9ff' : 'white';
    input2.style.background = activeInput === 'input2' ? '#f0f9ff' : 'white';
  }

  // Update labels based on operation
  function updateLabels(){
    if(currentOperation === 'division'){
      label1.textContent = '被除數';
      label2.textContent = '除數';
      operatorSymbol.textContent = '÷';
    } else {
      label1.textContent = '被乘數';
      label2.textContent = '乘數';
      operatorSymbol.textContent = '×';
    }
  }

  // Operation selector
  divisionBtn.addEventListener('click', () => {
    currentOperation = 'division';
    divisionBtn.classList.add('active');
    multiplicationBtn.classList.remove('active');
    updateLabels();
    clearAll();
  });

  multiplicationBtn.addEventListener('click', () => {
    currentOperation = 'multiplication';
    multiplicationBtn.classList.add('active');
    divisionBtn.classList.remove('active');
    updateLabels();
    clearAll();
  });

  // Number pad input
  numBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const num = btn.dataset.num;
      if(activeInput === 'input1'){
        // Prevent multiple leading zeros
        if(input1Value === '0' && num === '0') return;
        // Replace single '0' with new digit
        if(input1Value === '0' && num !== '0') input1Value = '';
        input1Value += num;
        input1.value = input1Value;
      } else {
        if(input2Value === '0' && num === '0') return;
        if(input2Value === '0' && num !== '0') input2Value = '';
        input2Value += num;
        input2.value = input2Value;
      }
    });
  });

  // Delete button
  deleteBtn.addEventListener('click', () => {
    if(activeInput === 'input1'){
      input1Value = input1Value.slice(0, -1);
      input1.value = input1Value;
    } else {
      input2Value = input2Value.slice(0, -1);
      input2.value = input2Value;
    }
  });

  // Switch input
  switchInput.addEventListener('click', () => {
    activeInput = activeInput === 'input1' ? 'input2' : 'input1';
    updateInputFocus();
  });

  // Clear all
  function clearAll(){
    input1Value = '';
    input2Value = '';
    input1.value = '';
    input2.value = '';
    resultPanel.hidden = true;
    ascii.textContent = '';
    stepsList.innerHTML = '';
    summary.textContent = '';
    activeInput = 'input1';
    updateInputFocus();
  }

  clearBtn.addEventListener('click', clearAll);

  // Calculate
  calcBtn.addEventListener('click', () => {
    const a = input1Value.trim();
    const b = input2Value.trim();
    
    try{
      if(!/^\d+$/.test(a) || !/^\d+$/.test(b)) { 
        alert('請輸入非負整數'); 
        return; 
      }
      
      if(a === '' || b === ''){
        alert('請輸入兩個數字');
        return;
      }

      if(currentOperation === 'division'){
        if(Number(b) === 0){ 
          alert('除數不能為 0'); 
          return; 
        }
        const res = longDivisionSteps(a, b);
        resultPanel.hidden = false;
        summary.textContent = `${a} ÷ ${b} = ${res.quotient} 餘 ${res.remainder}`;
        ascii.textContent = renderAsciiDivision(a, b, res);
        stepsList.innerHTML = '';
        res.steps.forEach((s, idx) => {
          const li = document.createElement('li');
          li.textContent = `位置 ${idx+1}（處理數字 ${String(a)[idx]}）: 部分=${s.partial} 減去=${s.subtract} 商=${s.quotientDigit} 餘數=${s.remainderAfter}`;
          stepsList.appendChild(li);
        });
      } else {
        const res = multiplicationSteps(a, b);
        resultPanel.hidden = false;
        summary.textContent = `${a} × ${b} = ${res.product}`;
        ascii.textContent = renderAsciiMultiplication(a, b, res);
        stepsList.innerHTML = '';
        res.steps.forEach((s, idx) => {
          const li = document.createElement('li');
          li.textContent = `步驟 ${idx+1}: ${s.note}`;
          stepsList.appendChild(li);
        });
      }
      
      // Scroll to results
      resultPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }catch(err){ 
      alert(err.message || String(err)); 
    }
  });

  // Initialize
  updateLabels();
  updateInputFocus();
});

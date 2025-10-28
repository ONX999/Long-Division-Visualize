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
function renderAscii(dividend, divisor, result){
  const left = String(divisor);
  const right = String(dividend);
  const q = String(result.quotient);
  const bar = left + ' ) ' + right + '\n' +
              ' '.repeat(left.length+3) + '-'.repeat(Math.max(right.length, q.length)) + '\n' +
              ' '.repeat(left.length+3) + q;
  let stepLines = [];
  result.steps.forEach((s, idx) => {
    if(s.subtract > 0){
      stepLines.push(`step ${idx+1}: partial=${s.partial} subtract=${s.subtract} remainder=${s.remainderAfter}`);
    } else {
      stepLines.push(`step ${idx+1}: partial=${s.partial} (不足以除)`);
    }
  });
  return bar + '\n\n' + stepLines.join('\n');
}
document.addEventListener('DOMContentLoaded', () => {
  const dividendEl = document.getElementById('dividend');
  const divisorEl = document.getElementById('divisor');
  const calcBtn = document.getElementById('calcBtn');
  const clearBtn = document.getElementById('clearBtn');
  const resultPanel = document.getElementById('resultPanel');
  const ascii = document.getElementById('asciiDivision');
  const stepsList = document.getElementById('steps');
  const summary = document.getElementById('summary');
  calcBtn.addEventListener('click', () => {
    const a = dividendEl.value.trim();
    const b = divisorEl.value.trim();
    try{
      if(!/^\d+$/.test(a) || !/^\d+$/.test(b)) { alert('請輸入非負整數'); return; }
      if(Number(b) === 0){ alert('除數不能為 0'); return; }
      const res = longDivisionSteps(a, b);
      resultPanel.hidden = false;
      summary.textContent = `商 = ${res.quotient} ，餘數 = ${res.remainder}`;
      ascii.textContent = renderAscii(a, b, res);
      stepsList.innerHTML = '';
      res.steps.forEach((s, idx) => {
        const li = document.createElement('li');
        li.textContent = `位置 ${idx+1}（處理數字 ${String(a)[idx]}）: partial=${s.partial} subtract=${s.subtract} quotientDigit=${s.quotientDigit} remainder=${s.remainderAfter}`;
        stepsList.appendChild(li);
      });
    }catch(err){ alert(err.message || String(err)); }
  });
  clearBtn.addEventListener('click', () => {
    dividendEl.value = '';
    divisorEl.value = '';
    resultPanel.hidden = true;
    ascii.textContent = '';
    stepsList.innerHTML = '';
    summary.textContent = '';
  });
});

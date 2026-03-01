// Load data from localStorage
const result = JSON.parse(localStorage.getItem('predictionResult'));
const studentData = JSON.parse(localStorage.getItem('studentData'));

if (!result || !studentData) {
    window.location.href = 'form.html';
}

const predictedCgpa = result.predicted_cgpa;
const datasetAverage = 5.40;

// ── 1. CGPA Counter Animation ─────────────────────────────────────────────
function animateCgpa(target) {
    let current = 0;
    const step = target / 60;
    const interval = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(interval);
        }
        document.getElementById('cgpaDisplay').textContent = current.toFixed(2);
    }, 16);
}

animateCgpa(predictedCgpa);

// ── 2. Grade Badge ────────────────────────────────────────────────────────
document.getElementById('gradeBadge').textContent = result.grade;

// ── 3. Risk Badge ─────────────────────────────────────────────────────────
const riskBadge = document.getElementById('riskBadge');
riskBadge.textContent = result.risk_level;
if (result.risk_color === 'green') {
    riskBadge.classList.add('risk-green');
} else if (result.risk_color === 'orange') {
    riskBadge.classList.add('risk-orange');
} else {
    riskBadge.classList.add('risk-red');
}

// ── 4. Insight Message ────────────────────────────────────────────────────
function generateInsight(cgpa, risk) {
    if (cgpa >= 9) {
        return "Outstanding performance! You are in the top tier of students. Keep maintaining your study habits and consistency. You are on track for excellent placement opportunities.";
    } else if (cgpa >= 8) {
        return "Excellent performance! Your study habits and academic consistency are paying off well. With continued effort you can push into the O grade range.";
    } else if (cgpa >= 7) {
        return "Good performance! You are above average. Small improvements in attendance and study time could push you into the A+ range. Stay consistent.";
    } else if (cgpa >= 6) {
        return "Average performance. You have a solid foundation but there is clear room for improvement. Focus on reducing absences and increasing daily study hours for a meaningful boost.";
    } else if (cgpa >= 5) {
        return "Below average performance. Your current habits suggest you are at risk of falling behind. Prioritise attendance, reduce distractions, and consider extra coaching support.";
    } else {
        return "You are at risk of poor academic performance this semester. Immediate action is recommended — attend all remaining classes, seek academic support, and dedicate more daily hours to study.";
    }
}

document.getElementById('insightText').textContent = generateInsight(predictedCgpa, result.risk_level);

// ── 5. Feature Importance Chart ───────────────────────────────────────────
function buildChart(importances) {
    const container = document.getElementById('chartContainer');
    const sorted = Object.entries(importances).sort((a, b) => b[1] - a[1]);
    const top10 = sorted.slice(0, 10);

    top10.forEach(([feature, percent]) => {
        const label = feature.replace(/_/g, ' ');
        const row = document.createElement('div');
        row.className = 'chart-row';
        row.innerHTML = `
            <div class="chart-label">${label}</div>
            <div class="chart-bar-container">
                <div class="chart-bar" data-width="${percent}"></div>
            </div>
            <div class="chart-percent">${percent}%</div>
        `;
        container.appendChild(row);
    });

    // Animate bars after render
    setTimeout(() => {
        document.querySelectorAll('.chart-bar').forEach(bar => {
            bar.style.width = bar.getAttribute('data-width') + '%';
        });
    }, 100);
}

buildChart(result.feature_importances);

// ── 6. What-If Simulator ──────────────────────────────────────────────────
const studytimeSlider  = document.getElementById('studytimeSlider');
const absencesSlider   = document.getElementById('absencesSlider');
const lectureSlider    = document.getElementById('lectureSlider');

// Set sliders to student's actual values
studytimeSlider.value = studentData.studytime_daily_hrs;
absencesSlider.value  = studentData.absences;
lectureSlider.value   = studentData.lecture_hrs_attended;

document.getElementById('studytimeVal').textContent = studentData.studytime_daily_hrs + ' hrs';
document.getElementById('absencesVal').textContent  = studentData.absences + ' days';
document.getElementById('lectureVal').textContent   = studentData.lecture_hrs_attended + ' hrs';
document.getElementById('whatifCgpa').textContent   = predictedCgpa.toFixed(2);

let debounceTimer;

function updateSliderLabels() {
    document.getElementById('studytimeVal').textContent = studytimeSlider.value + ' hrs';
    document.getElementById('absencesVal').textContent  = absencesSlider.value + ' days';
    document.getElementById('lectureVal').textContent   = lectureSlider.value + ' hrs';
}

async function fetchWhatIf() {
    const modifiedData = {
        ...studentData,
        studytime_daily_hrs:  parseFloat(studytimeSlider.value),
        absences:             parseInt(absencesSlider.value),
        lecture_hrs_attended: parseFloat(lectureSlider.value)
    };

    try {
        const response = await fetch('https://grade-predictor-ai.onrender.com/whatif', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(modifiedData)
        });

        const newResult = await response.json();
        const newCgpa = newResult.predicted_cgpa;
        const diff = (newCgpa - predictedCgpa).toFixed(2);

        document.getElementById('whatifCgpa').textContent = newCgpa.toFixed(2);

        const diffEl = document.getElementById('whatifDiff');
        if (diff > 0) {
            diffEl.textContent = '+' + diff + ' ↑';
            diffEl.className = 'whatif-diff diff-up';
        } else if (diff < 0) {
            diffEl.textContent = diff + ' ↓';
            diffEl.className = 'whatif-diff diff-down';
        } else {
            diffEl.textContent = 'No Change';
            diffEl.className = 'whatif-diff diff-same';
        }

    } catch (error) {
        console.log('What-if error:', error);
    }
}

function onSliderChange() {
    updateSliderLabels();
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(fetchWhatIf, 400);
}

studytimeSlider.addEventListener('input', onSliderChange);
absencesSlider.addEventListener('input', onSliderChange);
lectureSlider.addEventListener('input', onSliderChange);

// ── 7. Comparison Bars ────────────────────────────────────────────────────
function buildComparisonBars(cgpa) {
    const max = 10;
    const avgPercent  = (datasetAverage / max) * 100;
    const yourPercent = (cgpa / max) * 100;

    setTimeout(() => {
        document.getElementById('avgBar').style.width  = avgPercent + '%';
        document.getElementById('yourBar').style.width = yourPercent + '%';
    }, 300);

    document.getElementById('yourCgpaText').textContent = cgpa.toFixed(2);
}

buildComparisonBars(predictedCgpa);

// ── 8. Personalised Tips ──────────────────────────────────────────────────
function generateTips(data, cgpa) {
    const tips = [];

    if (data.absences > 15) {
        tips.push({
            icon: '📅',
            text: `You have ${data.absences} absences this semester. Reducing to under 10 could meaningfully improve your predicted CGPA. Attendance is one of the strongest negative factors in the model.`
        });
    }

    if (data.studytime_daily_hrs < 2) {
        tips.push({
            icon: '📚',
            text: `You are studying only ${data.studytime_daily_hrs} hours per day. Students who study 3-4 hours daily consistently score half to one full grade point higher. Try adding just 1 more hour daily.`
        });
    }

    if (data.lecture_hrs_attended < 3) {
        tips.push({
            icon: '🎓',
            text: `Your lecture attendance is low at ${data.lecture_hrs_attended} hours per day. Attending more classes directly exposes you to exam-relevant content and improves performance.`
        });
    }

    if (data.prev_cgpa < 5.5) {
        tips.push({
            icon: '📈',
            text: `Your previous CGPA of ${data.prev_cgpa} is the single strongest predictor in the model. Focus on fundamentals and seek academic support to build a stronger foundation this semester.`
        });
    }

    if (data.health < 3) {
        tips.push({
            icon: '💪',
            text: `Your health rating is low. Poor health directly impacts concentration, attendance, and performance. Prioritise sleep, nutrition, and physical activity — they are as important as study hours.`
        });
    }

    if (data.coaching === 'no' && cgpa < 6) {
        tips.push({
            icon: '🧑‍🏫',
            text: `Consider joining coaching or tuition for your weaker subjects. Students with extra academic support show a measurable improvement in final scores.`
        });
    }

    // Default tip if no specific ones triggered
    if (tips.length === 0) {
        tips.push({
            icon: '🌟',
            text: `Your profile looks strong. Keep maintaining your study habits, attendance, and health. Consistency is the key to pushing your CGPA even higher.`
        });
    }

    return tips;
}

function buildTips(data, cgpa) {
    const tips = generateTips(data, cgpa);
    const container = document.getElementById('tipsList');

    tips.forEach(tip => {
        const item = document.createElement('div');
        item.className = 'tip-item';
        item.innerHTML = `
            <div class="tip-icon">${tip.icon}</div>
            <div class="tip-text">${tip.text}</div>
        `;
        container.appendChild(item);
    });
}

buildTips(studentData, predictedCgpa);

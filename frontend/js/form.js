let currentStep = 1;
const totalSteps = 4;

function showStep(step) {
    document.querySelectorAll('.step-section').forEach(s => {
        s.classList.remove('active');
    });

    document.getElementById('step' + step).classList.add('active');

    const progress = (step / totalSteps) * 100;
    document.getElementById('progressBar').style.width = progress + '%';

    document.getElementById('stepLabel').textContent = 'Step ' + step + ' of ' + totalSteps;

    currentStep = step;
}

function validateStep(step) {
    let valid = true;

    const currentSection = document.getElementById('step' + step);
    const inputs = currentSection.querySelectorAll('input, select');

    inputs.forEach(input => {
        input.classList.remove('error');
        if (input.value === '' || input.value === null) {
            input.classList.add('error');
            valid = false;
        }
    });

    return valid;
}

function nextStep(step) {
    if (!validateStep(step - 1)) {
        alert('Please fill in all fields before continuing.');
        return;
    }
    showStep(step);
}

function prevStep(step) {
    showStep(step);
}

function collectData() {
    return {
        school:               document.getElementById('school').value,
        sex:                  document.getElementById('sex').value,
        age:                  parseInt(document.getElementById('age').value),
        city:                 document.getElementById('city').value,
        fam_size:             document.getElementById('fam_size').value,
        medu:                 parseInt(document.getElementById('medu').value),
        fedu:                 parseInt(document.getElementById('fedu').value),
        mjob:                 document.getElementById('mjob').value,
        fjob:                 document.getElementById('fjob').value,
        famrel:               parseInt(document.getElementById('famrel').value),
        reason:               document.getElementById('reason').value,
        traveltime:           parseInt(document.getElementById('traveltime').value),
        studytime_daily_hrs:  parseFloat(document.getElementById('studytime_daily_hrs').value),
        coaching:             document.getElementById('coaching').value,
        activities:           document.getElementById('activities').value,
        higher:               document.getElementById('higher').value,
        romantic:             document.getElementById('romantic').value,
        freetime:             parseInt(document.getElementById('freetime').value),
        health:               parseInt(document.getElementById('health').value),
        absences:             parseInt(document.getElementById('absences').value),
        lecture_hrs_attended: parseFloat(document.getElementById('lecture_hrs_attended').value),
        prev_cgpa:            parseFloat(document.getElementById('prev_cgpa').value),
        math_score:           parseFloat(document.getElementById('math_score').value),
        physics_score:        parseFloat(document.getElementById('physics_score').value),
        programming_score:    parseFloat(document.getElementById('programming_score').value),
        electronics_score:    parseFloat(document.getElementById('electronics_score').value),
        english_score:        parseFloat(document.getElementById('english_score').value)
    };
}

async function submitForm() {
    if (!validateStep(4)) {
        alert('Please fill in all fields before continuing.');
        return;
    }

    document.getElementById('step4').style.display = 'none';
    document.getElementById('loadingSection').style.display = 'block';

    const data = collectData();

    try {
        const response = await fetch('https://grade-predictor-ai.onrender.com/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        localStorage.setItem('predictionResult', JSON.stringify(result));
        localStorage.setItem('studentData', JSON.stringify(data));

        window.location.href = 'result.html';

    } catch (error) {
        document.getElementById('loadingSection').style.display = 'none';
        document.getElementById('step4').style.display = 'block';
        alert('Error connecting to server. Make sure Flask is running.');
    }
}
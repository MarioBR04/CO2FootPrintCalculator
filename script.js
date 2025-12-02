document.addEventListener('DOMContentLoaded', () => {
    const calculateBtn = document.getElementById('calculate-btn');
    const resultSection = document.getElementById('result');
    const scoreValue = document.getElementById('score-value');
    const feedbackText = document.getElementById('feedback-text');

    // CO2 Emission Factors (approximate values in kg CO2)
    const factors = {
        transport: {
            car: 0.192, // per km
            bus: 0.105, // per km
            bike: 0,    // per km
            train: 0.041 // Assuming train for public transport variety if needed, but using bus logic for now or adding train option
        },
        electricity: 0.475, // per kWh (global average approx)
        gas: 2.0, // per m3
        shopping: {
            minimalist: 500, // base annual footprint for goods
            average: 1500,
            consumerist: 3000
        },
        meat: {
            daily: 2500, // annual kg CO2
            weekly: 1500,
            rarely: 800,
            vegetarian: 500
        },
        hvac: 0.5 // per hour of use per day (rough estimate impact factor)
    };

    calculateBtn.addEventListener('click', () => {
        // 1. Get Values
        const transportMode = document.getElementById('transport-mode').value;
        const kmWeek = parseFloat(document.getElementById('km-week').value) || 0;
        const electricity = parseFloat(document.getElementById('electricity').value) || 0;
        const gas = parseFloat(document.getElementById('gas').value) || 0;
        const shopping = document.getElementById('shopping').value;
        const meat = document.getElementById('meat').value;
        const hvacHours = parseFloat(document.getElementById('hvac').value) || 0;

        // 2. Calculate Components (Annualized)
        
        // Transport: km/week * 52 weeks * factor
        // Note: 'bike' is 0, so it works out.
        // If user selected something else not in map, default to 0.
        let transportFactor = factors.transport[transportMode] || 0;
        // Adjust for 'bus' if we want to map 'train' or others later. 
        // For now, simple mapping.
        const transportEmission = kmWeek * 52 * transportFactor;

        // Energy: (kWh * 12) * factor + (m3 * 12) * factor
        const energyEmission = (electricity * 12 * factors.electricity) + (gas * 12 * factors.gas);

        // Habits: Fixed annual values
        const shoppingEmission = factors.shopping[shopping] || 0;
        const meatEmission = factors.meat[meat] || 0;

        // HVAC: Hours/day * 365 * factor (simplified logic)
        // Assuming the factor accounts for energy usage of an average unit per hour
        const hvacEmission = hvacHours * 365 * factors.hvac;

        // 3. Total
        const totalFootprint = transportEmission + energyEmission + shoppingEmission + meatEmission + hvacEmission;

        // 4. Display Result
        displayResult(totalFootprint);
    });

    function displayResult(total) {
        // Show the section
        resultSection.classList.remove('hidden');
        
        // Animate the number
        animateValue(scoreValue, 0, total, 1000);
        
        // Provide feedback
        let feedback = '';
        if (total < 4000) {
            feedback = "¡Excelente! Tu huella es muy baja. ¡Sigue así!";
            scoreValue.style.color = "#2ecc71"; // Green
        } else if (total < 10000) {
            feedback = "Estás en el promedio. Pequeños cambios pueden hacer una gran diferencia.";
            scoreValue.style.color = "#f1c40f"; // Yellow
        } else {
            feedback = "Tu huella es alta. Considera reducir el uso del auto o carne.";
            scoreValue.style.color = "#e74c3c"; // Red
        }
        feedbackText.textContent = feedback;

        // Add visible class for CSS transition
        setTimeout(() => {
            resultSection.classList.add('visible');
        }, 10);
        
        // Scroll to result
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString();
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
});

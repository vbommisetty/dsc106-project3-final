document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('yearRange');
    const yearDisplay = document.getElementById('yearDisplay');
    const circleContainers = document.querySelectorAll('.circle-container');
    const tooltip = document.getElementById('tooltip'); // Get tooltip element

    function colorScale(crimeRate, vi) {

        const color = d3.scaleLinear()
            .domain([0, 0.34]) 
            .range(["green", "red"]);
        return color(vi / crimeRate);
    }

    function radius(crimeRate) {
        
        const rad = d3.scaleSqrt()
            .domain([0, 53.89]) 
            .range([0, 20]);
        return rad(crimeRate);
    }

    function displayDataForYear(year) {
        fetch('SANDAG_Crime_Data_20240512.csv')
            .then(response => response.text())
            .then(data => {
                const rows = data.split('\n').slice(1); 
                const filteredData = rows
                    .map(row => row.split(','))
                    .filter(row => row[0] === year.toString());

                filteredData.forEach(row => {
                    const location = row[1];
                    const crimeRate = parseFloat(row[2]);
                    const vi = parseFloat(row[3]);
                    const circleContainer = Array.from(circleContainers).find(container => container.querySelector('.text').textContent === location);
                    if (circleContainer) {
                        const circle = circleContainer.querySelector('.circle');
                        circle.style.backgroundColor = colorScale(crimeRate, vi);
                        const circleRadius = radius(crimeRate);
                        circle.style.width = `${circleRadius * 2}px`; 
                        circle.style.height = `${circleRadius * 2}px`; 
                        
                        
                        circle.addEventListener('mouseover', function(event) {
                            tooltip.textContent = `Location: ${location}, Crime Rate: ${crimeRate}, Violent Crime Rate: ${vi}`;
                            tooltip.style.display = 'block';

                            tooltip.style.left = `calc(100% + 10px)`; 
                            tooltip.style.top = `${event.clientY}px`; 
                            

                        });
                        
                        
                        circle.addEventListener('mouseout', function() {
                            tooltip.style.display = 'none';
                        });
                    }
                });
            });
    }

    slider.addEventListener('input', function() {
        yearDisplay.textContent = slider.value;
        displayDataForYear(slider.value);
    });

    
    displayDataForYear(slider.value);

    
    
    
});

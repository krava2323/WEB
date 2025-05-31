function getInputValue(id) {
    const value = parseFloat(document.getElementById(id).value);
    if (isNaN(value)) {
        alert(`Будь ласка, введіть коректне числове значення для поля з ID: ${id}`);
        throw new Error(`Invalid input for ${id}`);
    }
    return value;
}

function calculateReliability() {
    try {
        const lambdaSingleLine = getInputValue('lambda-single');
        const muSingleLine = getInputValue('mu-single');
        const lambdaSingleTransformer = getInputValue('lambda-transformer-single');
        const muSingleTransformer = getInputValue('mu-transformer-single');

        const pSingleLine = muSingleLine / (lambdaSingleLine + muSingleLine); 
        const pSingleTransformer = muSingleTransformer / (lambdaSingleTransformer + muSingleTransformer);
        const pSystemSingle = pSingleLine * pSingleTransformer;
        const qSystemSingle = 1 - pSystemSingle; 
        const tRecoverySingle = (lambdaSingleLine / (lambdaSingleLine + muSingleLine) * (1/muSingleLine) + 
                                 lambdaSingleTransformer / (lambdaSingleTransformer + muSingleTransformer) * (1/muSingleTransformer)) * 8760; // в годинах на рік

        const lambdaDualLine = getInputValue('lambda-dual');
        const muDualLine = getInputValue('mu-dual');
        const lambdaDualTransformer = getInputValue('lambda-transformer-dual');
        const muDualTransformer = getInputValue('mu-transformer-dual');

        const qDualLine = lambdaDualLine / (lambdaDualLine + muDualLine);
        const qBothLinesDual = qDualLine * qDualLine; 
        const pBothLinesDual = 1 - qBothLinesDual; 
        
        const qDualTransformer = lambdaDualTransformer / (lambdaDualTransformer + muDualTransformer);
        const qBothTransformersDual = qDualTransformer * qDualTransformer;
        const pBothTransformersDual = 1 - qBothTransformersDual;

        const pSystemDual = pBothLinesDual * pBothTransformersDual;
        const qSystemDual = 1 - pSystemDual;
        const tRecoveryDual = qSystemDual * 10; 


        const resultsDiv = document.getElementById('reliability-results');
        resultsDiv.innerHTML = `
            <h3>Результати порівняння надійності:</h3>
            <p><strong>Одноколова система:</strong></p>
            <p>Ймовірність безвідмовної роботи: ${pSystemSingle.toFixed(5)}</p>
            <p>Ймовірність відмови: ${qSystemSingle.toFixed(5)}</p>
            <p>Орієнтовний середній час простою на рік: ${tRecoverySingle.toFixed(2)} годин</p>
            <br>
            <p><strong>Двоколова система:</strong></p>
            <p>Ймовірність безвідмовної роботи: ${pSystemDual.toFixed(5)}</p>
            <p>Ймовірність відмови: ${qSystemDual.toFixed(5)}</p>
            <p>Орієнтовний середній час простою на рік: ${tRecoveryDual.toFixed(2)} годин (ПОТРІБНА КОРЕКТНА ФОРМУЛА!)</p>
            <br>
            <p><em>Примітка: Розрахунки надійності є спрощеними. Для точних значень зверніться до методик з Прикладу 3.1.</em></p>
        `;
    } catch (error) {
        console.error("Помилка в розрахунку надійності:", error);
        document.getElementById('reliability-results').innerHTML = `<p style="color: red;">Помилка в розрахунках. Перевірте вхідні дані.</p>`;
    }
}

function calculateDamage() {
    try {
        const outageDuration = getInputValue('outage-duration'); 
        const powerShortage = getInputValue('power-shortage');   
        const specificDamage = getInputValue('specific-damage'); 

        const totalDamage = powerShortage * specificDamage; 

        const resultsDiv = document.getElementById('damage-results');
        resultsDiv.innerHTML = `
            <h3>Результати розрахунку збитків:</h3>
            <p>Загальні середньорічні збитки від перерв електропостачання: ${totalDamage.toFixed(2)} грн</p>
            <p><em>Примітка: Розрахунок збитків базується на наданих агрегованих даних та питомих збитках.</em></p>
        `;
    } catch (error) {
        console.error("Помилка в розрахунку збитків:", error);
        document.getElementById('damage-results').innerHTML = `<p style="color: red;">Помилка в розрахунках. Перевірте вхідні дані.</p>`;
    }
}

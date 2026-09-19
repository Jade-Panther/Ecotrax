import { getSpecies } from '../../app/api.js';


let autos, stateInputs;

const autocompleteSpecies = (species, list, input) => {
    list.innerHTML = ''
    species.forEach(s => {
        const lItem = document.createElement('li')
        lItem.textContent = s.common_name
        lItem.addEventListener('click', () => {
            input.value = s.common_name
            list.style.display = 'none'
        })
        list.appendChild(lItem)
    })
}

const autocompleteState = (el) => {
    const val = el.value.toLowerCase()
    const list = document.querySelector('.state-autocomplete-container ul')
    const states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']
    
    list.style.display = 'block'
    list.innerHTML = ''
    console.log(val.length)
    states.forEach(s => {
        if(val.length === 0 || s.toLowerCase().startsWith(val)) {
            const lItem = document.createElement('li')
            lItem.textContent = s
            lItem.addEventListener('click', () => {
                document.querySelector('#filter-state').value = s
                list.style.display = 'none'
            })
            list.appendChild(lItem)
        }
    })
}

export const initAutocomplete = () => {
    autos = document.querySelectorAll('.species-autocomplete-container');
    stateInputs = document.querySelectorAll('.state-autocomplete-container input');

    // Species autocomplete
    autos.forEach(el => {
        const input = el.querySelector('input')
        const list = el.querySelector('ul')
        input.addEventListener('input', async function() {
            const val = this.value

            if(val.length > 1) {
                let suggested = await getSpecies(val)
                if(suggested.length > 0)  {
                    list.style.display = 'block'
                    autocompleteSpecies(suggested, list, input)
                }
                else {
                    list.style.display = 'none'
                }
            }
            else {
                list.style.display = 'none'
            }
        })
    })

    // State autocomplete logic
    stateInputs.forEach(s => {
        s.addEventListener('input', () => autocompleteState(s))
        s.addEventListener('click', () => autocompleteState(s))
        s.addEventListener('blur', () => {
            setTimeout(() => {
                const list = s.parentElement.querySelector('ul')
                list.style.display = 'none'
            }, 200)
        })
    })
}



// document.querySelector('form') - Pesquisa os campos correspondente
//  a tag na página


// Código para pegar dinamicamente estados e municípios para o formulário

//                             Dados da Entidade



function populateUFs() {
    const ufSelect = document.querySelector('select[name=uf]')
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
        .then( res => res.json()) //Arrow function - Função anonima simplificada
        .then( states => {
            for (state of states) {
                ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
            }

        })

}

populateUFs()


function getCities(event) {
    const citySelect = document.querySelector('[name=city]')
    const stateInput = document.querySelector('[name=state]')
    const ufValue = event.target.value

    const indexOfSelectedState =event.target.selectedIndex
    stateInput.value = event.target.options[indexOfSelectedState].text

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`

    citySelect.innerHTML = "<optin value>Selecione a cidade</option>"
    citySelect.disabled = true


    fetch(url)
        .then(res => res.json()) //Arrow function - Função anonima simplificada
        .then(cities => {


            for (city of cities) {
                citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
            }

            citySelect.disabled = false

        })
}



document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities)








//                              Itens de Coleta

const itensToCollect = document.querySelectorAll(".itens-grid li")

for (const item of itensToCollect) {
    item.addEventListener("click", handleSelectedItem)
}


const collectedItems = document.querySelector("input[name=items]")

let selectedItems = []

function handleSelectedItem(event) {
    const itemLi = event.target

    itemLi.classList.toggle("selected")

    const itemId = itemLi.dataset.id

    // console.log("ITEM ID: ", itemId)

    // varificar se existem itens selecionados, se sim
    // pegar os itens selecionados

    const alreadySelected = selectedItems.findIndex( item => {
        const itemFound = item == itemId
        return itemFound
    })

    // se já estiver selecionado
    if (alreadySelected >= 0) {
        // tirar da seleção
        const filteredItems = selectedItems.filter( item => {
            const itemIsDifferente = item != itemId
            return itemIsDifferente
        })
        selectedItems = filteredItems
    }   else {
        //se não estiver selecionado
        // adicionar a seleção
        selectedItems.push(itemId)
    }

    // console.log("selectedItems: ", selectedItems)


    // atualizar campo escondido com os itens selecionados
    collectedItems.value = selectedItems
}

const recBtn = document.querySelector('#recipes');
const slBtn = document.querySelector('#s-list');
const recipeContent = document.querySelector('.content');
const formBtn = document.getElementById('form-btn');
const dishInput = document.getElementById('dish');
const ingredientsInput= document.getElementById('ingredients');
const instructionsInput= document.getElementById('instructions');
const notesInput= document.getElementById('notes');
const inputsF= document.querySelectorAll('input');
const editBtn= document.getElementById('edit');



const baseURL= 'http://localhost:4000/recipes';


const clearContent = ()=> recipeContent.innerHTML= '';
const clearInput = ()=>{
    dishInput.value= ''
    ingredientsInput.value = ''
    instructionsInput.value = ''
    notesInput.value= ''
};


const displayRecipe= (reci) =>{
    let recipeEntrys = document.createElement('div');
    recipeEntrys.classList.add('entryCont');
    if(reci.notes === null){
        reci.notes = ''
    };    
    recipeEntrys.innerHTML = 
    `<section>
    <div class= 'rTitle'>
    <h2 id='dish${reci.dish_id}'><span>${reci.dish}</span></h2>
    <button class='actionBtns' id='edit${reci.dish_id}'><img id='img${reci.dish_id}' class= 'editIcon' src="../img/—Pngtree—black edit icon_4422168.png" alt="edit"></button>
    <button class='actionBtns'><img id='delete${reci.dish_id}' class= 'deleteIcon' src="../img/icons8-trash-64.png" alt="delete"></button>
    </div>
    <h3>Ingredients:</h3><p id='ingredients${reci.dish_id}'><span>${reci.ingredients}</span></p>
    <h3>Instructions:</h3><a id='instructions${reci.dish_id}' href='${reci.instructions}'><span>How to Make ${reci.dish}</span></a>
    <h3>Notes:</h3><p id='notes${reci.dish_id}'><span>${reci.notes}</span></p>
    </section>`;
    
    recipeContent.appendChild(recipeEntrys);

    const title= document.getElementById(`dish${reci.dish_id}`);
    const list= document.getElementById(`ingredients${reci.dish_id}`);
    const link= document.getElementById(`instructions${reci.dish_id}`);
    const notes= document.getElementById(`notes${reci.dish_id}`);
    const editBtn= document.getElementById(`edit${reci.dish_id}`);
    const deleteBtn= document.getElementById(`delete${reci.dish_id}`);
    const editImg =document.getElementById(`img${reci.dish_id}`);
    const href= link.getAttribute('href');
    


    deleteBtn.addEventListener('click', function deleteRecipe(){
        axios
        .delete(`${baseURL}/${reci.dish_id}`)
        .then((res)=>{
            getRecipes()
        })
    });

    editBtn.addEventListener('click', (e)=>{
        if(e.target.tagName === 'IMG'){
            link.removeAttribute('href');
            
            const span1 = title.firstElementChild;
            const span2 = list.firstElementChild;
            const span3 = link.firstElementChild;
            const span4 = notes.firstChild;

            const input1 = document.createElement('input');
            const input2 = document.createElement('input');
            const input3 = document.createElement('input');
            const input4 = document.createElement('input');

            input1.type = 'text';
            input2.type = 'text';
            input3.type = 'text';
            input4.type = 'text';

            input1.value= span1.textContent;
            input2.value= span2.textContent;
            input3.value= href;
            input4.value= span4.textContent;

            title.insertBefore(input1, span1);
            list.insertBefore(input2, span2);
            link.insertBefore(input3, span3).nextSibling;
            notes.insertBefore(input4, span4);

            title.removeChild(span1);
            list.removeChild(span2);
            link.removeChild(span3);
            notes.removeChild(span4);

            editBtn.textContent= 'Save';
            editImg.classList.add('hide');
            editBtn.classList.add('saveBtn');
            editBtn.classList.remove('actionBtns');

        }else if(e.target.textContent === 'Save'){
            const input1 = title.firstElementChild;
            const input2 = list.firstElementChild;
            const input3 = link.firstElementChild;
            const input4 = notes.firstElementChild;

            const span1= document.createElement('span');
            const span2= document.createElement('span');
            const span3= document.createElement('span');
            const span4= document.createElement('span');

            span1.textContent = input1.value;
            span2.textContent = input2.value;
            span3.textContent = input3.value;
            link.setAttribute('href', input3.value);
            span4.textContent = input4.value;

            title.insertBefore(span1, input1);
            list.insertBefore(span2, input2);
            link.insertBefore(span3, input3);
            notes.insertBefore(span4, input4);

            title.removeChild(input1);
            list.removeChild(input2);
            link.removeChild(input3);
            notes.removeChild(input4);

            editBtn.innerHTML = `<img id='img${reci.dish_id}' class= 'editIcon' src="../img/—Pngtree—black edit icon_4422168.png" alt="edit">`
            editImg.classList.remove('hide');
            editBtn.classList.remove('saveBtn');
            editBtn.classList.add('actionBtns');

            let ingredientsList = input2.value.split(' , ');
            
            let updatedRecipe= {
                dish: input1.value,
                ingredients: ingredientsList,
                instructions: input3.value,
                notes: input4.value
            }

            axios
            .put(`${baseURL}/${reci.dish_id}`, updatedRecipe)
            .then((res)=>{
                getRecipes()
            })
        }
    });
};


const getRecipes = () =>{
    axios
    .get(baseURL)
    .then((res) =>{
        clearContent()
        recipeContent.classList.add('content2')
        for(i= 0; i < res.data.length; i++){
            displayRecipe(res.data[i])
        };
    })
    .catch((err=> console.log(err)))
};

const newRecipe= (e)=>{
    e.preventDefault()
    
    let ingredientsList = ingredientsInput.value.split(' , ');
    let reciBody ={
        dish: dishInput.value,
        ingredients: ingredientsList,
        instructions: instructionsInput.value,
        notes: notesInput.value
    };
    
    clearInput()
    axios
    .post(baseURL, reciBody)
    .then((res=>{
            clearContent()
            if(typeof(res.data) === 'string'){
                alert(`${res.data}`)
            }else{
                recipeContent.classList.add('content2')
                getRecipes();    
            };
        }))
    .catch((err=> console.log(err)))
};

recBtn.addEventListener('click', getRecipes);
formBtn.addEventListener('click', newRecipe);


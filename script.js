const inputslider= document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copiedMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-btn");
const allCheckBox = document.querySelectorAll("input[type='checkbox']");
const symbols='!@#$%&';
let password="";
let passwordlength=10 ;
let checkcount=1;
handleSlider();
setIndicator("#ccc");


function handleSlider(){
    inputslider.value=passwordlength;
    lengthDisplay.innerText=passwordlength;

    const min=inputslider.min;
    const max=inputslider.max;
    inputslider.style.backgroundSize = ((passwordlength-min)*100/(max-min))+"% 100%";
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow =`0px 0px 12px 1px ${color}`;
} 

function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}

function getRndNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol(){
    const randNum=getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;
    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numberCheck.checked) hasNum=true;
    if(symbolsCheck.checked) hasSym=true;

    if(hasUpper && hasLower &&(hasNum || hasSym) && passwordlength>=8){
        setIndicator("#0f0");
    }
    else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordlength>=6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }

}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    }
    catch{
         copyMsg.innerText="failed";
    }

    copyMsg.classList.add("active");
    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);
}

inputslider.addEventListener('input',(e)=>{
    passwordlength=e.target.value;
    handleSlider(); 
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
        copyContent(); 
})

function handleCheckboxChange(){
    checkcount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked) 
            checkcount++;
    });
    if(passwordlength<checkcount){
        passwordlength=checkcount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => { 
    checkbox.addEventListener('change',handleCheckboxChange);
});

function shufflePassword(array){
     
    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach(el => {
        str+=el;
    });
    return str;
}

generateBtn.addEventListener('click',()=>{
    if(checkcount<=0) return;

    if(passwordlength<checkcount){
        passwordlength=checkcount;
        handleSlider();
    }

    password="";

    let funcArr=[];
    if(uppercaseCheck.checked){
        funcArr.push(generateUpperCase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    }
    if(numberCheck.checked){
        funcArr.push(getRndNumber);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol); 
    }


    for(let i=0; i<funcArr.length;i++){
        password+=funcArr[i]();
    }

    for(let i=0;i<passwordlength-funcArr.length;i++){
        let ranIdx=getRndInteger(0,funcArr.length);
        password+=funcArr[ranIdx]();
    }

    password=shufflePassword(Array.from(password));
    passwordDisplay.value=password;
    calcStrength();
});

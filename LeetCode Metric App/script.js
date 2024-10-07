document.addEventListener("DOMContentLoaded",function(){

    const userInput = document.getElementById("user-input")
    const searchBtn = document.getElementById("search-btn")
    const statsContainer = document.querySelector(".stats-container")
    const easyProgressCircle = document.querySelector(".easy-progress")
    const mediumProgressCircle = document.querySelector(".medium-progress")
    const hardProgressCircle = document.querySelector(".hard-progress")
    const easyLevel = document.querySelector("#easy-level")
    const mediumLevel = document.querySelector("#medium-level")
    const hardLevel = document.querySelector("#hard-level")
    const statsCardContainer = document.querySelector(".stats-card")
    const errorClass = document.querySelector(".error")
    const userNameDisplay = document.querySelector(".user-name")

    function validateUserName(userName){
        if(userName.trim() === ""){
            alert("Input Field Cannot Be Empty");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,35}$/;
        const isMatching = regex.test(userName);
        if(!isMatching){
            userNameDisplay.style.display = "none"
            statsContainer.style.display = "none"
            errorClass.classList.add("error-hidden")
            alert("Invalid Username");
        }
        return isMatching;
    }
    
    async function fetchUserDetail(userName){
        try{
            searchBtn.textContent = "Searching..."
            searchBtn.disabled = true;

            const response = await fetch("https://leetcode-api-faisalshohag.vercel.app/" + userName)
            const data = await response.json();
            console.log(response.status)
            statsContainer.style.display = "block"
            if(!data.errors){
                userNameDisplay.style.display = "block"
                console.log(data)
            }  
            else{
                statsCardContainer.innerHTML = ""
                throw new Error("Error Found")
            }
            errorClass.classList.add("error-hidden")
            errorClass.classList.remove("error-unhidden")
            userNameDisplay.innerHTML = `<h2>${userName}<h2>`
            displayUserData(data);   
        }  
        catch(error){
            errorClass.innerHTML = `<p>Username does not exist.</p>`
            errorClass.classList.add("error-unhidden")
            errorClass.classList.remove("error-hidden")
            userNameDisplay.style.display = "none"
            statsContainer.style.display = "none"
        }
        finally{
            searchBtn.textContent = "Search"
            searchBtn.disabled = false;
        }

        function updateUserData(solved,total,level,circle){
            const progressDegree = (solved/total)*100;
            console.log(progressDegree)
            level.textContent = `${solved}/${total}`
            circle.style.setProperty("--progress-degree", `${progressDegree}%`)
        }

        function displayUserData(data){
            const totalQuestions = data.totalQuestions;
            const totalEasy = data.totalEasy;
            const totalMedium = data.totalMedium;
            const totalHard = data.totalHard;

            console.log(totalQuestions,totalEasy,totalMedium,totalHard)

            const totalSolved = data.totalSolved;
            const easySolved = data.easySolved;
            const mediumSolved = data.mediumSolved;
            const hardSolved = data.hardSolved;
            
            console.log(totalSolved,easySolved,mediumSolved,hardSolved)

            updateUserData(easySolved,totalEasy,easyLevel,easyProgressCircle)
            updateUserData(mediumSolved,totalMedium,mediumLevel,mediumProgressCircle)
            updateUserData(hardSolved,totalHard,hardLevel,hardProgressCircle)


            console.log(data.totalSubmissions[0].submissions)
            const cardsData = [
                {
                    label: "Overall Submissions",
                    value: data.totalSubmissions[0].submissions
                },
                {
                    label: "Overall Easy Submissions",
                    value: data.totalSubmissions[1].submissions
                },
                {
                    label: "Overall Medium Submissions",
                    value: data.totalSubmissions[2].submissions
                },
                {
                    label: "Overall Hard Submissions",
                    value: data.totalSubmissions[3].submissions
                },
            ];

            console.log(cardsData)
            
            statsCardContainer.innerHTML = ""
            cardsData.map(data =>{
                const div = document.createElement('div')
                const h4 = document.createElement('h4')
                const p = document.createElement('p')
                h4.innerHTML =`${data.label}`
                p.innerHTML = `${data.value}`
                div.appendChild(h4)
                div.appendChild(p)
                div.classList.add('cards')
                statsCardContainer.appendChild(div)
            })
        }
    }

    searchBtn.addEventListener("click",function(){
        const userName = userInput.value;
        if(validateUserName(userName)){
            fetchUserDetail(userName);
        }
        userInput.value = ""
    })
})
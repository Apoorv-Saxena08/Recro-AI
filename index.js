console.log("Working");

function submitPrompt(){
    const prompt = document.getElementById("promptInput").value.trim();
    const experience = document.getElementById("experience").value;
    const interview = document.getElementById("interviewType").value;
    console.log(prompt + " " + experience + " " + interview);

    //validation
    if(!prompt || !experience || !interview){
        Swal.fire({
            icon: "error",
            title: "Oops",
            text: "You missed something",
            // footer: '<a href="#">Why do I have this issue?</a>'
        });
        return;
    }

    const params = new URLSearchParams({
        prompt: prompt,
        experience: experience,
        type: interview
    });

    window.location.href = `interview.html?${params.toString()}`

}
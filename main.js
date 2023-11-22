// RUNGPT

    // to add, internet access and help.


const GPT = require('./GPT/gpt');
const VirtualTerminal = require('./VirtualTerminal/Terminal');


var shouldRun = true;

var gpt = new GPT();

var convo = gpt.newConversation();


async function main() {


    var currentTask = "Create a spotify to mp3 downloader"


    const terminal = new VirtualTerminal()


    convo.addUser(`

        ================

        You are a programmer, you have access to a virtual terminal.
        In this terminal, you can navigate menus to solve a given task.

        In order to achieve this goal, you have been given access to a virtual terminal.
        
        The task has been split up into steps and sub steps. You will focus on one sub step at a time to achieve the final goal.
        
        The final goal: ${currentTask}

        In order to avoid context window size limitations, you will attempt to achieve a smaller goal with each sub step.
        
        The virtual terminal allows you to log what you have attempted, make notes and edit code.
        
        GPT (you) have been provided this terminal to achieve a final goal

        The virtual terminal features the following:

        1) Steps - Each step is a smaller subtask towards a final goal.
        2) Diary - The diary contains a list of each item you have already attempted (within other conversations). 
        3) Notes - You are encouraged to write notes for yourself. This should include comments, suggestions, views and useful advice for your future self.
        4) Code - Provides a sub menu that allows you to run/edit/execute code from the virtual terminal.
        
        You should revisit the terminal to refresh your knowledge to ensure the best outcome.

        You will navigate this terminal to achieve an outcome, do not attempt the same thing repeatedly, attempt a new decision.

        Each reply should contain:

        - A command in square brackets
        - A description of what you are deciding to do, and reasoning why in surrounded by asterisks.

        
        ================

    `) 

    var terminalOutput = terminal.run()
    console.log(terminalOutput)
    convo.addUser(terminalOutput)


    while(shouldRun){
        await new Promise((done) => {
            convo.compute().then(async (answer) => {

                var asteriskCount = (answer.match(/\*/g) || []).length;
    
                convo.addSystem(answer)
    
                if(asteriskCount >= 2){
                    var thought = answer.match(/\*(.*?)\*/)[1];
                    var action = answer.match(/\[(.*?)\]/)[1];
        
                    console.log("\n".repeat(3))
                    console.log("GPT Thought: " + thought)
                    console.log("GPT Action: " + action)
                    console.log("\n".repeat(3))
        
        
                    terminalOutput = terminal.run(action)
                    console.log(terminalOutput)
        
                    convo.addUser(terminalOutput)
                } else {
                    convo.addUser(`
                    ================
        
                    Your response did not contain asterisks. Please use these to explain what you are attempting to do.#

                    Each reply should contain:

                    - A command in square brackets
                    - A description of what you are deciding to do, and reasoning why in surrounded by asterisks.

                    An example

                    [help]
                    *I will use the "help" command to see the available options in the main menu. This will give me a better understanding of the commands I can use.* 
                    
                    ================\n\n> `)

                    console.log("GPT ERROR RESPONSE: " + answer)

                    console.log(`<GPT DID NOT USE asterisks, asking to repeat message>`)
    
                }
    
                done()
            })
        })
        await new Promise(r => setTimeout(r, 6000));

    }

}

async function questions(){
    const readline = require('readline');
            
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    while(true){
        await new Promise((done) => {
            console.log("\n\n\n\n\n\n\n\n\n\n\n")
            rl.question(">", (input) => {
                shouldRun = false;
                convo.addUser(input)
                convo.compute().then(async (answer) => {
                    convo.addSystem(answer)
                    console.log(answer)  
                    done()
                })
            });
        });
        await new Promise(r => setTimeout(r, 5000));
    }
}




main();
questions();
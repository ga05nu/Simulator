// Process class representing a task or process
class Process {
    constructor(name) {
      this.name = name;
      this.state = 'ready'; // Possible states: ready, running, terminated
    }
    
    run() {
      console.log(`Process ${this.name} is running.`);
      this.state = 'running';
      // Simulating the execution time of the process
      setTimeout(() => {
        this.terminate();
      }, Math.random() * 5000); // Random execution time between 0 to 5000 milliseconds
    }
    
    terminate() {
      console.log(`Process ${this.name} has terminated.`);
      this.state = 'terminated';
    }
  }
  
  // Multiprogramming with a Variable Number of Tasks (MPVT) class
  class MPVT {
    constructor() {
      this.processes = []; // Array to store the processes
    }
    
    addProcess(process) {
      this.processes.push(process);
      console.log(`Process ${process.name} added.`);
      if (process.state === 'ready') {
        this.runProcess(process);
      }
    }
    
    runProcess(process) {
      if (process.state === 'ready') {
        console.log(`Process ${process.name} is ready to run.`);
        process.run();
      }
    }
  }
  
  // Usage
  const os = new MPVT();
  
  // Creating and adding processes
  const process1 = new Process('Process 1');
  const process2 = new Process('Process 2');
  const process3 = new Process('Process 3');
  
  os.addProcess(process1);
  os.addProcess(process2);
  os.addProcess(process3);
  
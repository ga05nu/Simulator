class Process {
    constructor(name) {
      this.name = name;
      this.state = 'ready';
    }
    
    run() {
      this.state = 'running';
      const block = document.getElementById(`process${this.name.slice(-1)}`);
      block.classList.remove('ready');
      block.classList.add('running');
      setTimeout(() => {
        this.terminate();
      }, Math.random() * 5000);
    }
    
    terminate() {
      this.state = 'terminated';
      const block = document.getElementById(`process${this.name.slice(-1)}`);
      block.classList.remove('running');
      block.classList.add('terminated');
    }
  }
  
  class MFT {
    constructor() {
      this.processes = [];
    }
    
    addProcess(process) {
      this.processes.push(process);
      const block = document.getElementById(`process${process.name.slice(-1)}`);
      block.classList.add('ready');
      if (process.state === 'ready') {
        this.runProcess(process);
      }
    }
    
    runProcess(process) {
      if (process.state === 'ready') {
        process.run();
      }
    }
  }
  
  const os = new MFT();
  const process1 = new Process('Process 1');
  const process2 = new Process('Process 2');
  const process3 = new Process('Process 3');
  
  os.addProcess(process1);
  os.addProcess(process2);
  os.addProcess(process3);
  
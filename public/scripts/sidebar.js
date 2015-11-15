var departmentsMock = [
  {id: 1, name: "工程研发部门"},
  {id: 2, name: "产品设计部门"},
]

var jobsMock = [
  {id: 1, department_id: 1, name: "Mac 测试开发工程师", quantity: 9},
  {id: 2, department_id: 1, name: "IOS App 测试工程师", quantity: 17},
  {id: 3, department_id: 2, name: "网页设计师",         quantity: 30},
  {id: 4, department_id: 2, name: "ID / 工业设计师",    quantity: 30},
];

var getJobsByDepartmentId = function (id) {
  var jobs = [];

  jobsMock.map(function (job) {
    if (job.department_id == id) {
      jobs.push(job);
    }
  })

  return jobs;
}

var serverGetDepartments = function () {
  return departmentsMock.map(function (department) {
    return department;
  });
}

var serverGetJobsByDepartmentId = function (id) {
  return getJobsByDepartmentId(id);
}

var serverDeleteJobById = function (id) {
  var jobs = jobsMock;
  jobsMock = jobs.filter(function (job) {
    return (job.id != id); 
  })

  console.log("Delete Job " + id);
  console.log(jobsMock);
}

var JobRow = React.createClass({
  render: function() {
    console.log("JobRow render");

    var job = this.props.job;
    return(
      <div className="jobRow">
      <input type="checkbox" className="jobCheckbox" checked={job.checked} value={job.id} />
      <div>{job.name}</div>
      <div>{job.quantity}</div>
      </div>
    );
  }
});

var JobTable = React.createClass({
  getInitialState: function() {
    return {
      jobs: [],
    };
  },

  updateJobs: function () {
    var department = this.props.department,
      id = department.id;

    /* dynamic load here  */
    var jobs = serverGetJobsByDepartmentId(id);
    console.log(jobs);
    this.setState({jobs: jobs.map(function (job) {
      job.checked = false; 
      return job;
    })});
  },

  componentWillMount: function () {
    console.log("Job Table cWm");
    this.updateJobs();
  },

  componentWillReceiveProps: function () {
    console.log("Job Table wrp");
    this.updateJobs();
  },

  handleJobStateChange: function (e) {
    var t = e.target,
      that = this;

    var _setJobsState = function (checked, id) {
      if (id === undefined) {
        this.setState(function (previousState, currentProps) {
          return previousState.jobs.map(function (job) {
              job.checked = checked;
              that.props.onJobStateChange(checked, job.id);
            return job;
          }); 
        });
      }
      else {

        this.setState(function (previousState, currentProps) {
          return previousState.jobs.map(function (job) {
            if (job.id == id) {
              job.checked = checked;
              that.props.onJobStateChange(checked, job.id);
            }
            return job;
          }); 
        });
      }
    }

    var setJobsState = _setJobsState.bind(this);

    switch (t.className) {
      case "departmentCheckbox":
        if (t.checked)
          setJobsState(true);         
        else
          setJobsState(false);         
        break;
      case "jobCheckbox":
        if (t.checked)
          setJobsState(true, t.value);
        else
          setJobsState(false, t.value);
        break;
      default:
        break;
    }

    e.stopPropagation();

    console.log(this.state.jobs);
  },

  render: function() {
    console.log("JobTable render");
    console.log(this.state.jobs);

    var department = this.props.department,
      jobs = this.state.jobs,
      quantity = 0;

    var that = this;
    var jobRowNodes = jobs.map(function (job) {
      quantity += job.quantity;
      return (
        <JobRow key={job.id} job={job} />
      );
    });
    
    if (quantity > 0) {
      return (
        <div className="jobTable" onChange={this.handleJobStateChange}>
        <p><input type="checkbox" className="departmentCheckbox" checked={this.state.jobState} value={department.id}/></p>
        <p>{department.name}</p>
        <p>{quantity}</p>
        {jobRowNodes}
        </div>
      );
    }
    else {
      return false;
    }
  }
});

var JobBox = React.createClass({

  jobState: {},

  getInitialState: function() {
    return {
      departments: [],
    };
  },

  componentDidMount: function() {

    /* dynamic load here  */
    var departments = serverGetDepartments();
    console.log("Job box cdm");
    console.log(departments);
    this.setState({departments: departments});
  },

  handleJobStateChange: function (checked, id) {
    console.log(id);
    if (checked) {
      if (this.jobState[id] !== undefined) 
        this.jobState[id]  = true;
      else
        this.jobState[id] = true;
    }
    else {
      if (this.jobState[id] !== undefined)
        this.jobState[id] = false;
    }

    console.log(this.jobState);
  },

  handleButtonClick: function () {
    Object.getOwnPropertyNames(this.jobState).map(function (id) {
      /* delete job  */                                                 
      serverDeleteJobById(id);
    });
    var departments = serverGetDepartments();
    this.setState({departments: departments});
  },

  render: function() {
    console.log("JobBox render");
    console.log(this.state.departments);
    console.log(departmentsMock);
    console.log(jobsMock);

    var that = this;
    var jobTableNodes = this.state.departments.map(function (department) {
      var id = department.id;
      return (
        <JobTable key={department.id} department={department} onJobStateChange={that.handleJobStateChange}/>
      );
    });

    return (
      <div className="jobBox">
      <p>招聘职位</p>
      <button onClick={this.handleButtonClick}>清空</button>
      {jobTableNodes}
      </div> 
    );
  }
});


var Sidebar = React.createClass({
  render: function() {
    console.log("Sidebar render");
    return (
      <div className="sidebar">
      <JobBox data={departmentsMock} />
      </div>
    );
  }
});

ReactDOM.render(
  <Sidebar/>,
  document.getElementById('sidebar')
);


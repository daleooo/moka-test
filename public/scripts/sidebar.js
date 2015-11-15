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
}

var JobRow = React.createClass({
  render: function() {
    console.log("JobRow render");

    var job = this.props.job;
    return(
      <div className="job-row flex-container">
      <div className="job-row-placeholder"></div>
      <input type="checkbox" className="job-row-checkbox" checked={job.checked} value={job.id} />
      <p className="job-row-name">{job.name}</p>
      <p className="job-row-quantity">{job.quantity}</p>
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
    this.setState({jobs: jobs.map(function (job) {
      job.checked = false; 
      return job;
    })});
  },

  componentWillMount: function () {
    this.updateJobs();
  },

  componentWillReceiveProps: function () {
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
      case "job-table-checkbox":
        console.log("table");
        if (t.checked)
          setJobsState(true);         
        else
          setJobsState(false);         
        break;
      case "job-row-checkbox":
        console.log("row");
        if (t.checked)
          setJobsState(true, t.value);
        else
          setJobsState(false, t.value);
        break;
      default:
        break;
    }

    e.stopPropagation();
  },

  render: function() {
    console.log("JobTable render");

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
        <div className="job-table" onChange={this.handleJobStateChange}>
        <div className="job-table-header flex-container">
        <input type="checkbox" className="job-table-checkbox" checked={this.state.jobState} value={department.id}/>
        <p className="job-table-name">{department.name}</p>
        <p className="job-table-quantity">{quantity}</p>
        </div>
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
    this.setState({departments: departments});
  },

  handleJobStateChange: function (checked, id) {
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

    var that = this;
    var jobTableNodes = this.state.departments.map(function (department) {
      var id = department.id;
      return (
        <JobTable key={department.id} department={department} onJobStateChange={that.handleJobStateChange}/>
      );
    });

    return (
      <div className="job-box">
      <div className="flex-container">
      <p className="job-box-name">招聘职位</p>
      <button className="job-box-button" onClick={this.handleButtonClick}>清空</button>
      </div>
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
      <JobBox />
      </div>
    );
  }
});

ReactDOM.render(
  <Sidebar/>,
  document.getElementById('sidebar')
);


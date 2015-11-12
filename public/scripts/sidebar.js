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

var JobRow = React.createClass({
  render: function() {
    console.log("JobRow render");

    var job = this.props.job;
    return(
      <tr className="jobRow">
      <td></td>
      <td><input type="checkbox" /></td>
      <td>{job.name}</td>
      <td>{job.quantity}</td>
      </tr>
    );
  }
});

var JobTable = React.createClass({
  render: function() {
    console.log("DepartmentBox render");

    var department = this.props.department,
      jobs = department.jobs,
      quantity = 0;

    var jobRowNodes = jobs.map(function (job) {
      quantity += job.quantity;
      return (
        <JobRow key={job.id} job={job} />
      );
    });

    return (
      <div className="jobTable">
      <p><input type="checkbox" /></p>
      <p>{department.name}</p>
      <p>{quantity}</p>
      <table>
      <tbody>
      {jobRowNodes}
      </tbody>
      </table> 
      </div>
    );
  }
});

var JobBox = React.createClass({
  render: function() {
    console.log("JobBox render");

    var jobTableNodes = departmentsMock.map(function (department) {
      department.jobs = getJobsByDepartmentId(department.id);
      return (
        <JobTable key={department.id} department={department} />
      );
    });

    return (
      <div className="jobBox">
      <p>招聘职位</p>
      <p>清空</p>
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


import {Component} from 'react'
import Cookies from 'js-cookie'
import {BiSearchAlt2} from 'react-icons/bi'
import FilterGroup from '../FilterGroup/filter'
import './job.css'

const jobConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Job extends Component {
  state = {
    employmentType: [],
    salaryPackage: '',
    search: '',
    apiStatus: jobConstants.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    const {employmentType, salaryPackage, search} = this.state
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentType.join()}&minimum_package=${salaryPackage}&search=${search}`
    const token = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    console.log(response)
    const data = await response.json()
    console.log(data)
  }

  onClickLogOut = () => {
    Cookies.remove('jwt_token')
    const {history} = this.props
    history.replace('/login')
  }

  header = () => {
    console.log('header')
    return (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
        />
        <div>
          <h1>Home</h1>
          <h1>Jobs</h1>
        </div>
        <button type="button" onClick={this.onClickLogOut}>
          Logout
        </button>
      </div>
    )
  }

  // enter label
  sendLabel = (label, status) => {
    console.log(label)
    /*
    switch (label) {
      case 'FULLTIME':
        return this.setState({fulltime: 'FULLTIME'}, this.getJobDetails)
      case 'PARTTIME':
        return this.setState({parttime: 'PARTTIME'}, this.getJobDetails)
      case 'FREELANCER':
        return this.setState({freelancer: 'FREELANCE'}, this.getJobDetails)
      case 'INTERNSHIP':
        return this.setState({internship: 'INTERNSHIP'}, this.getJobDetails)
      default:
        return null
    }
    */
    if (status === false) {
      const {employmentType} = this.state
      const index = employmentType.indexOf(label)
      const newArray = employmentType.splice(index, 1)
      console.log(employmentType)
      this.setState({employmentType}, this.getJobDetails)
    } else {
      this.setState(
        prevState => ({employmentType: [...prevState.employmentType, label]}),
        this.getJobDetails,
      )
    }
  }

  // enter salary
  sendSalary = salary => {
    console.log(salary)
    this.setState({salaryPackage: salary}, this.getJobDetails)
  }

  // enter search
  enterSearchKey = event => {
    this.setState({search: event.target.value}, this.getJobDetails)
  }

  // start switch
  startSwitch = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case jobConstants.success:
        return this.successView()
      case jobConstants.failure:
        return this.failureView()
      case jobConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    const {search} = this.state
    return (
      <div>
        {this.header()}
        <FilterGroup sendLabel={this.sendLabel} sendSalary={this.sendSalary} />
        <div>
          <div>
            <input
              type="search"
              onChange={this.enterSearchKey}
              value={search}
            />
            <BiSearchAlt2 />
          </div>
          <div>{this.startSwitch()}</div>
        </div>
      </div>
    )
  }
}
export default Job

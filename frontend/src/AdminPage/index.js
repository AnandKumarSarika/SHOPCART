

import { Component } from "react";
import LeftNav from "../Navbar";
//import BarGraph from "../BarChart";
//import { BarChart } from '@mui/x-charts/BarChart';
import PieChart from "../PieChart";

import './index.css'
class AdminPage extends Component{
    state = {users:0,products:0,orders:0}
    componentDidMount(){
        this.fetchNoOfProducts()
        this.fetchNoOfUsers()
        this.fetchNoOfOrders()
    }

    fetchNoOfProducts = async () =>{
        const response = await fetch('http://localhost:8080/product', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode:"cors",
      });
      const data = await response.json()
      console.log(data)
      this.setState({products:data.length})
    }

    fetchNoOfUsers = async () =>{
        const response = await fetch('http://localhost:8080/users', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            mode:"cors",
          });
          const data = await response.json()
          console.log(data)
          this.setState({users:data.length})
    }
    fetchNoOfOrders = async() =>{
        const response = await fetch('http://localhost:8080/admin/orders/sum', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            mode:"cors",
          });
          const data = await response.json()
          console.log(data)
          this.setState({orders:data.totalOrders})
    }

 
    render(){
        const {products,users,orders} = this.state
        const pieChartData = {
            labels: ['Users', 'Orders', 'Products'],
            datasets: [
              {
                data: [users, orders, products],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
              },
            ],
          };
        const list = [{link:"admin-home",value:"Home"},{link:"newproduct",value:"Add Product"},{link:"all-orders",value:"All Orders"},{link:"login",value:"Logout"}]
        return(
            <div className="admin-home">
                <LeftNav options = {list}/>
                <ul className="container">
                    <li className="sub-container">
                        <h3>Number of Users</h3>
                        <h1 style={{marginTop:"10px",fontSize:"35px"}}>{users}</h1>
                    </li>
                    <li className="sub-container">
                        <h3>Number of Products</h3>
                        <h1 style={{marginTop:"10px",fontSize:"35px"}}>{products}</h1>
                    </li>
                    <li className="sub-container">
                        <h3>Number of Orders</h3>
                        <h1 style={{marginTop:"10px",fontSize:"35px"}}>{orders}</h1>
                    </li>
                </ul>
                <div className="pie-chart-container">
                    {/* <PieChart data={pieChartData} /> */}
                </div>
            </div>
        )
    }
}

export default AdminPage
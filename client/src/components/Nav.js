import React from 'react';
import {Link} from 'react-router-dom';
import '../App.css';
import {Menu} from 'antd'
import { HomeOutlined,  ReadOutlined, LogoutOutlined  } from '@ant-design/icons';
import {connect} from 'react-redux';


function Nav(props) {

  return (
    <nav >
      <Menu style={{textAlign: 'center'}} mode="horizontal" theme="dark">

        <Menu.Item key="mail">
          <Link to="/screensource"><HomeOutlined />Sources</Link>
          
        </Menu.Item>

        <Menu.Item key="test">
          <Link to="/screenmyarticles"><ReadOutlined />My Articles ({props.Articles.length})</Link>
          
        </Menu.Item>

        <Menu.Item key="app">
         <Link to="/"> <LogoutOutlined />Logout</Link>
          
        </Menu.Item>

      </Menu>
    </nav>
  );
}

function mapStateToProps(state) {
  return { 
    Articles : state.wishlist
   }
 
  };

  export default connect(
    mapStateToProps,
    null,
    )
    (Nav);
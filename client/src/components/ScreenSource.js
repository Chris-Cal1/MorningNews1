import React,{useState, useEffect} from 'react';
import {Link} from 'react-router-dom'
import '../App.css';
import { List, Avatar} from 'antd';
import Nav from './Nav'
import { connect } from 'react-redux';

function ScreenSource(props) {

  //(1.2) Cet état matérialise la liste des différentes sources.
  const [sourceList, setSourceList] = useState([])
  const [selectedLang, setSelectedLang] = useState(props.selectedLang)


  useEffect(() => {
    const findLang = async() => {
      
      const reqFind = await fetch(`/user-lang?token=${props.token}`)
      const resultFind = await reqFind.json()

      setSelectedLang(resultFind.lang)
    }

    findLang()
  }, [])


  useEffect(() => {
    //(1.3) Mise en place de la mécanique permettant d'interroger l’URL de l'API.
    const APIResultsLoading = async() => {

      var langue = 'fr'
      var country = 'fr'
        
      if(selectedLang == 'en'){
        var langue = 'en'
        var country = 'us'
      }
     // props.changeLang(selectedLang)
      const data = await fetch(`https://newsapi.org/v2/sources?language=${langue}&country=${country}&apiKey=29c72389097041eb95bfa58a3ef924eb`)
      const body = await data.json()
      //(1.4) Mise en place de la mécanique permettant de mettre à jour l’état sourceList avec la réponse reçue du webservice
      setSourceList(body.sources)
    }

    APIResultsLoading()
  }, [selectedLang])


  var updateLang = async (lang) => {
    setSelectedLang(lang)

    const reqLang = await fetch('/user-lang', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: `lang=${lang}&token=${props.token}`
    })
  }

  var styleBorderFr = {width:'40px', margin:'10px',cursor:'pointer'}

  if(selectedLang == 'fr'){
    styleBorderFr.border = '1px solid black'
  }

  var styleBorderEn = {width:'40px', margin:'10px',cursor:'pointer'}

  if(selectedLang == 'en'){
    styleBorderEn.border = '1px solid black'
  }


   //(1.5)  Exploitation de l’état sourceList pour mettre à jour le composant afin qu’il matérialise visuellement les différentes sources d’informations
  // (1.6) Modification du lien pour y faire transiter l’ID de la source, ligne 43
  return (
    <div>
        <Nav/>
       
       <div style={{display:'flex', justifyContent:'center', alignItems:'center'}} className="Banner">
          <img style={{width:'40px', margin:'10px',cursor:'pointer'}} src='/images/fr.png' onClick={() => updateLang('fr')} />
          <img style={{width:'40px', margin:'10px',cursor:'pointer'}} src='/images/uk.png' onClick={() => updateLang('en')} /> 
        </div>

       <div className="HomeThemes">
          
              <List
                  itemLayout="horizontal"
                  dataSource={sourceList}
                  renderItem={source => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar src={`/images/${source.category}.png`} />}
                        title={<Link to={`/screenarticlesbysource/${source.id}`}>{source.name}</Link>}
                        description={source.description}
                      />
                    </List.Item>
                  )}
                />


          </div>
                 
      </div>
  );
}

function mapStateToProps(state){
  return {selectedLang: state.selectedLang, token: state.token}
}

function mapDispatchToProps(dispatch){
  return {
    changeLang: function(selectedLang){
      dispatch({type: 'changeLang', selectedLang: selectedLang})
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScreenSource)


console.log("Content js script loaded.");

const idNombre = "#ctl00_MainContentPlaceHolder_tabDatosGenerales_panelTextoFrecuente_NombreDestinatarioTextBox";
const idApellido = "#ctl00_MainContentPlaceHolder_tabDatosGenerales_panelTextoFrecuente_ApellidoDestinatarioTextBox";
const idCodigoPostal = "#ctl00_MainContentPlaceHolder_tabDatosGenerales_panelTextoFrecuente_CodigoPostalDestinatarioTextBox";
const idCalle = "#ctl00_MainContentPlaceHolder_tabDatosGenerales_panelTextoFrecuente_CalleDestinatarioTextBox";
const idNroCalle = "#ctl00_MainContentPlaceHolder_tabDatosGenerales_panelTextoFrecuente_NumeroDestinatarioTextBox";
const idPiso = "#ctl00_MainContentPlaceHolder_tabDatosGenerales_panelTextoFrecuente_PisoDestinatarioTextBox";
const idDpto = "#ctl00_MainContentPlaceHolder_tabDatosGenerales_panelTextoFrecuente_DepartamentoDestinatarioTextBox";

// content.js
chrome.runtime.onMessage.addListener(
  function(request) {
    
    if(request.message === 'onCartaDocumentoSelected'){
      console.info("onCartaDocumentoSelected", request);

      const cartaDocumento = request.cartaDocumento;
      
      $(idNombre).val(cartaDocumento.nombre);
      $(idApellido).val(cartaDocumento.apellido);

      $(idCalle).val(cartaDocumento.calle);
      $(idNroCalle).val(cartaDocumento.nroCalle);

      $(idPiso).val(cartaDocumento.piso);
      $(idDpto).val(cartaDocumento.depto);      

      $(idCodigoPostal).val(cartaDocumento.codigoPostal);     
    }
  }
);

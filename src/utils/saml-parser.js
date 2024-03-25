import * as saml from "saml-encoder-decoder-js";
import {parseString, Builder} from "xml2js";

export const decodeAuthRequestId = async (samlReq) => {
    return new Promise((resolve, reject) => {
        saml.decodeSamlRedirect(samlReq, (err, xml) => {
            parseString(xml, function (err, result) {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                resolve(result["samlp:AuthnRequest"]["$"]["ID"]);
            });
        });
    })
}

export const appendingRequestId = async (xmlContent, requestId) => {
    return new Promise((resolve, reject) => {
        // Parse the XML content into a JavaScript object
        try {
            xmlContent = xmlContent.replace(`InResponseTo="surge"`, `InResponseTo="${requestId}"`);
            xmlContent = xmlContent.replace(
                `<Response xmlns:xsd="http://www.w3.org/2001/XMLSchema`,
                `<Response InResponseTo="${requestId}"  xmlns:xsd="http://www.w3.org/2001/XMLSchema`
            );
        }catch (e) {
            console.log(e);
            reject(e)
        }
    })
}
/**
 * xml = xml.replace(`InResponseTo="surge"`, `InResponseTo="${requestId}"`);
 *  xmlContent = xmlContent.replace(
 `<Response xmlns:xsd="http://www.w3.org/2001/XMLSchema`,
 `<Response InResponseTo="${requestId}"  xmlns:xsd="http://www.w3.org/2001/XMLSchema`
 );
 */

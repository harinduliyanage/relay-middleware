import * as saml from "saml-encoder-decoder-js";
import {parseString} from "xml2js";

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

        // append InResponseTo to the first tag
        xmlContent = xmlContent.replace(`InResponseTo="surge"`, `InResponseTo="${requestId}"`);
        // added a whole string slice to make it more unique
        xmlContent = xmlContent.replace(
            `<Response xmlns:xsd="http://www.w3.org/2001/XMLSchema`,
            `<Response InResponseTo="${requestId}"  xmlns:xsd="http://www.w3.org/2001/XMLSchema`
        );

        saml.encodeSamlRedirect(xmlContent, function (err, encoded) {
            if (err) {
                reject(err);
            }
            resolve(encoded);
        });
    })

}

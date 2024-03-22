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
        parseString(xmlContent, (err, result) => {
            if (err) {
                console.error(err);
                reject(err);
            }

            // Update the InResponseTo attribute value
            result.Response.$.InResponseTo = requestId;

            // Convert the JavaScript object back to XML
            const builder = new Builder();
            const updatedXmlContent = builder.buildObject(result);
            resolve(updatedXmlContent);
        });
    })

}

// ShareTray.js
import React from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  FacebookIcon,
  XIcon,
  WhatsappIcon,
  LinkedinIcon,
  TelegramIcon
} from 'react-share';

const ShareTray = () => {
  const currentUrl = window.location.href;
  const message = "Check out this awesome website!";

  return (
    <>
        <div style={{position: 'absolute', top: '0px', bottom: '0px', left: '0px', right: '0px', background: 'rgba(0,0,0,70%)', zIndex: '99999'}}>
            <div style={{ position: 'absolute', display: 'flex', justifyContent: 'center', gap: '10px', top: '40%', bottom: '35%', left: '10%', right: '10%', background: 'rgba(0,0,0,70%)', borderRadius: '10px'}}>
                <h5 style={{position: 'absolute',display: 'flex', color:'#ffffff',top: '5%', left: '1.5%'}}>Share To:</h5>
                <div id="shareTrayClose" style={{position: 'absolute',border: '2px solid #ffffff', borderRadius: '3px', position: 'absolute', top: '5%', right: '1.5%', padding: '0.5px 4px 3px 4px', fontSize: 'x-small', alignSelf: 'end', marginBottom: '10px', color: '#ffffff'}}></div>
                <div style={{ display: 'flex', overflowX: 'auto', justifyContent: 'center', gap: '10px'}}>
                    <FacebookShareButton url={currentUrl} quote={message}>
                        <FacebookIcon size={32} round={true} />
                    </FacebookShareButton>

                    <TwitterShareButton url={currentUrl} title={message}>
                        <XIcon size={32} round={true} />
                    </TwitterShareButton>

                    <WhatsappShareButton url={currentUrl} title={message}>
                        <WhatsappIcon size={32} round={true} />
                    </WhatsappShareButton>

                    <LinkedinShareButton url={currentUrl} title={message}>
                        <LinkedinIcon size={32} round={true} />
                    </LinkedinShareButton>

                    <TelegramShareButton url={currentUrl} title={message}>
                        <TelegramIcon size={32} round={true} />
                    </TelegramShareButton>
                </div>
                {/* add a copy to clicpbord option */}
            </div>
        </div>
    </>
  );
};

export default ShareTray;

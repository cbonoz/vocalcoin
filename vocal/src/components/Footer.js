import React, { Component } from 'react'
import vocal from '../assets/vocal_trans_white.png';
import vocalWebp from '../optimized_media/vocal_trans_white.webp';

export default class Footer extends Component {

    render() {
        return (
            <footer >
                <div className="footer-distributed">

                    <div className="footer-left">

                        <h3><img alt="Vocal Coin" src={vocal} webp={vocalWebp} className="footer-image" /></h3>
                        <p className="footer-slogan">Distributed Political Currency</p>

                        <p className="footer-links">
                            <a href="/">Home</a>&nbsp;-&nbsp;
                            <a href="/faq">FAQ</a>&nbsp;-&nbsp;
                            <a href="/whitepaper">Whitepaper</a>&nbsp;-&nbsp;
                            <a href="mailto:blackshoalgroup@gmail.com">Contact</a>
                        </p>

                        <p className="footer-company-name">Vocal Project &copy; 2018</p>

                        <div className="footer-icons">
                            {/*<a href="/"><i className="fa fa-facebook"></i></a>*/}
                            {/*<a href="/"><i className="fa fa-twitter"></i></a>*/}
                            {/*<a href="/"><i className="fa fa-linkedin"></i></a>*/}
                            {/*<a href="/"><i className="fa fa-github"></i></a>*/}
                        </div>

                    </div>
                </div>

            </footer>
        )
    }
}

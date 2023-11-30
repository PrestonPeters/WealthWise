import React from "react";
import '../Home/home.css';
function Home() {
    return (
        <main>
            <section className="hero">
                <div className="container-fluid">
                    <h1 className="mt-5">Welcome to WealthWise</h1>
                    <p>Discover the world of opportunities with us.</p>
                </div>
            </section>

            <section className="about-us">
                <div className="container">
                    <h2>About Us</h2>
                    <p>
                        We are a team dedicated to bringing you the best experience. Our website offers 
                        a wide range of services tailored to meet your needs. From providing the latest 
                        information in technology to offering personalized solutions, our goal is to 
                        help you navigate the digital world with ease.
                    </p>

                    <h2>Meet the team:</h2>
                    <p> 
                        <list>
                            Waleed Ahmad, 
                            Anmol Dhunna, 
                            Karan Kairon,
                            Aman Mansuri, 
                            Preston Peters,
                            Prajakta Sanjay Sutar, 
                            David Simonov 
                        </list>
                    </p>
                </div>
            </section>
        </main>
    );
}

export default Home;

import React from 'react'
import styles from './footer.module.css'
const Footer = () => {
    return (
        <footer>
            <div className={styles.footer}>
                <div className={styles.ref}>
                    <h3>Addis Eats</h3>
                    <p>Sharing traditions from the Ethiopian <br /> highlands - one Gursha at a time</p>

                </div>
                <div className= {styles.hour}>
                    <h3>HOSPITALITY HOURS</h3>
                    <p>Tuesday - Sunday: 11:30 AM - 11:00PM</p>
                    <p>Monday: Reserved for Private Banquets</p>
                    <h5>Jebena Buna & Fresh Roasting All Evening</h5>
                </div>
                <div className={styles.tradition}>
                    <h3>DIETARY TRADITIONS</h3>
                    <p>Vegan Fasting(Beyaynetu/Tsom)</p>
                    <p>Traditional Prime Meat Feasts</p>
                    <p>House Tej(Pure Honey Wine)</p>
                    <p>Jebena Buna Roasting Ceremony</p>
                </div>
                <div className={styles.location}>
                    <h3>ADDIS LOCATION</h3>
                    <p>Bole Medhanialem, Addis Ababa & <br /> express delivery across town</p>
                    <h5>+251911234567</h5>
                </div> 
                
            </div>
           <p>&copy; 2026 Addis Eats</p>
        </footer>
    )
}

export default Footer
import android from "./android"
import ios from './ios'
import Browser from "./browser"
const browser = Browser();
export default {
    android,
    ios,
    $methods: browser.os.ios ? ios : android,
    browser
}  
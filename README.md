<img src='./assets/vocal_trans_black.png' style="margin: 0 auto;"/>

# Vocal Coin
A Minimally Viable Distributed Political Currency.
---

Vocal is a currency platform for promoting social change and civic engagement.

We have an open beta website at https://www.vocalcoin.com

### What Vocal Solves:

- Engagement in politics is declining in younger demographics, engaging in political issues can seem intimidating, and sometimes not immediately accessible*.
- Often little transparency into others opinions and issues happening around me.
- Vocal offers an immutable ledger of votes and issue creation (using the Ethereum blockchain) that serves as proof of when votes/issues were created.
- Lack of a universal incentive system for political participation. We now propose/create that system through the use of Vocal coin - which can be redeemed for agenda promotion, issue creation (and other things to come) through a traceable currency.
- No widely accessible platform for political engagement and discovery on a local / map scale.
- Yelp-like platform enables map-search of active political issues. Quickly and easily find the issues that are most pertinent to you and your community, without having to sift through a huge world of political agendas and issues.

<i>*citation to come.</i>

### How it works:

<ol>
    <li>User signs up for a vocal account (this will automatically create a 'Vocal' wallet for that user that is either owned by them or managed by the Vocal platform) </li>
    <li>User earns Vocal coin by casting votes on particular government or other individuals' issues</li>
    <li>User redeems those vocal token for promoting his or her own initiatives (and/or social credit i.e. user gains publicity). Other opportunities for redemption can be possible in the future.</li>
    <li>Governments can also promote and add issues that they want information about from local communities, questions such as 'What would be the most valuable improvement to this town? Or should we make this investment?'</li>
</ol>

### Screenshots

<div style="margin: 0 auto">

<b>Vocal Home Page</b><br/>

<img src="./assets/vocal_home.png" style="max-width: 600px; margin: 0 auto; text-align: center"/>

<b>Vocal Whitepaper/Proposal on Website</b><br/>

<img src="./assets/vocal_paper.png" style="max-width: 600px; margin: 0 auto; text-align: center"/>

<b>Vocal Create Issue on Location (City: Cambridge)</b><br/>

<img src="./assets/vocal_map_cambridge.png" style="max-width: 600px; margin: 0 auto; text-align: center"/>

<b>Vocal Create Issue Dialog (City: Cambridge)</b><br/>

<img src="./assets/vocal_issue_crimson.png" style="max-width: 600px; margin: 0 auto; text-align: center"/>

<b>Vocal Search (Sample Issues - Chicago)</b><br/>

<img src="./assets/vocal_map_chicago.png" style="max-width: 600px; margin: 0 auto; text-align: center"/>

<b>Vocal Help</b><br/>

<img src="./assets/vocal_help.png" style="max-width: 600px; margin: 0 auto; text-align: center"/>


</div>

### Demo Video

<a target="_blank" href="https://youtu.be/-_xxKBeUTdg">Original Demo Video</a>

### Future Work

- Better sorting/searching/filtering of issues on the map. i.e. finding by categories or creators.
- Implement remaining use cases for Vocal coin
- Potentially make Vocal purchase-able on the Ethereum blockchain. One unit of Vocal today might be redeemable for some amount of political value, but might be worth much more in the future (offers speculative value).
- Interaction/Trading between users
- Improve UI / Remaining Beta Bug Fixes

## Repository Contents:
* /slidedeck - Contains the pitch slidedeck for Vocal Coin.
* /whitepaper - vocal whitepaper tex and build output files such as the pdf.
* /vocal - Front end and server code.
* /vocalcontract - smart contract code and deployment logic (truffle).
*/assets - other images/resources


## Truffle Instructions:

Instructions to deploy contract to Ropsten testnet.

```
cd vocal/vocalcontract
truffle compile
truffle migrate --network ropsten
```

## Vocal Contract Address:
0x6135004c5b2b44493779ce86d6739f57dde674e0

## Example CURL command to test blockchain routes: 
curl -v -H "Authorization: Bearer 123456789" -X POST  http://127.0.0.1:9007/api/vote

## Instructions for Users:
* Sign up for a wallet at https://www.myetherwallet.com/ (on the Ropsten network) or use existing wallet if you have one. Make sure you
use the Ropsten test network on the upper right corner if using myetherwallet.com. Or let Vocal create the wallet/address and manage it for you.
* Sign up for an account on https://www.vocalcoin.com
* Create your first issue, or being voting on other existing issues.
* Explore and contribute to issues happening in your area, and worldwide.

**Simple long tail mev example: Bean Finance**

Beanstalk is a stablecoin protocol that uses a decentralized credit facility, variable supply and self-adjusting interest rate, to
regularly cross the stablecoin price over its value peg without affecting users.

To stabilize the value of the peg and ensure 'protocol native time-keeping', there is a function `sunrise()` that can be called once a 'season' (every hour). The award for calling it starts at 100 Beans and compounds 1% every additional second that elapses past the beginning of the season for up to 300 seconds. 

This leads to a maximum extraction per hour of $1978 - gas + swap fees (if no one else calls the function for 5 minutes). 

> Strategy: Battering Ram - send FB request to call the function every 5 seconds with high enough gas bid to win the auction; after calling it enough immediately at the start of enough seasons, all other bots will eventually turn off (which you can test by delaying the call for a single a block) due to node running costs. Then, wait 300 seconds before calling to maximize the `sunrise()` reward for as many blocks until the competitors return, and then repeat the Battering Ram. 

// this script will be automated by Heroku Scheduler
// it will run every every sunday at 00:01 UTC
// for dev, we'll run it every 2 minutes

// this script needs to query the goals table
// select all goals that are not complete
// join the users table on uid and select allowance
// for each goal -> 
//  if allowance > contribution amt. -> 
//    if goal amt. - current amt. > contribution amt. ->      
//      subtract contribution amt. from allowance && add to goal
//    if goal amt. - current amt. = contribution amt. ->
//      subtract contribution amt. from allowance && add to goal
//      set "completed" to true
//      alert user: goal successful
//    if goal amt. - current amt. < contribution amt. ->
//      subtract (goal amt. - current amt.) from allowance && add to goal
//      set "completed" column true
//      alert user: goal successful
//    
//  if allowance < contribution amt. -> 
//    alert user: not enough allowance to fund goal
// 
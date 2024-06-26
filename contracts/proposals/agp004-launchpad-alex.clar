;; Author: Marvin Janssen / ALEX Dev Team

(impl-trait .proposal-trait.proposal-trait)

(define-constant ONE_8 (pow u10 u8))

(define-constant fee-to-address .executor-dao)
(define-constant amount-per-ticket u300) ;; number of $ALEX per IDO ticket
(define-constant wstx-per-ticket-in-fixed (* u48 ONE_8)) ;; 300 * 0.16 STX required per IDO ticket (in 8-digit fixed notation)
(define-constant tickets u1050) ;; total number of IDO tickets to win $ALEX
(define-constant registration-start u44513) ;; ~ 10am HKT, Jan 10, 2022 / block-height when registration opens
(define-constant registration-end u45593) ;; ~ 10pm HKT, Jan 17, 2022 / ~ 7.5 days from registration start / block-height when registration closes / claim opens
(define-constant claim-end u46601) ;; ~ 10pm HKT, Jan 24, 2022 / ~ 7 days from registration end / block-height when claim ends
(define-constant activation-threshold u1050) ;; minimum number of IDO tickets to be registered before listing activates

(define-public (execute (sender principal))
	(contract-call? .alex-launchpad create-pool .age000-governance-token .lottery-ido-alex fee-to-address amount-per-ticket wstx-per-ticket-in-fixed registration-start registration-end claim-end activation-threshold)
)

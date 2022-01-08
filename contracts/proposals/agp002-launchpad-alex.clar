(impl-trait .proposal-trait.proposal-trait)

(define-constant fee-to-address .alex-vault)
(define-constant amount-per-ticket u0) ;; number of $ALEX per IDO ticket
(define-constant wstx-per-ticket-in-fixed u0) ;; STX required per IDO ticket (in 8-digit fixed notation)
(define-constant tickets u0) ;; total number of IDO tickets to win $ALEX
(define-constant registration-start u0) ;; block-height when registration opens
(define-constant registration-end u0) ;; block-height when registration closes / claim opens
(define-constant claim-end u0) ;; block-height when claim ends
(define-constant activation-threshold u0) ;; minimum number of IDO tickets to be registered before listing activates

(define-public (execute (sender principal))
	(begin
		(try! (contract-call? .alex-launchpad create-pool .age000-governance-token .lottery-ido-alex fee-to-address amount-per-ticket wstx-per-ticket-in-fixed registration-start registration-end claim-end activation-threshold))
		(contract-call? .alex-launchpad add-to-position .age000-governance-token tickets)
	)
)

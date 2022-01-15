import {
  Clarinet,
  Tx,
  Chain,
  Account,
  types,
} from "https://deno.land/x/clarinet@v0.14.0/index.ts";

const daoAddress = "ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.executor-dao";
const bootstrapAddress =
  "ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.agp000-bootstrap";
const age000Address =
  "ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.age000-governance-token";

const agp003Address =
  "ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.agp003-launchpad-alex";
const agp005Address =
  "ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.agp005-wstx-alex-50-50";
const agp006Address =
  "ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.agp006-flash-loan-fee";
const agp007Address =
  "ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.agp007-staking-default";
const agp008Address =
  "ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.agp008-staking-alex";
const agp009Address =
  "ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.agp009-wstx-wbtc-50-50";  

class DAO {
  chain: Chain;
  deployer: Account;

  constructor(chain: Chain, deployer: Account) {
    this.chain = chain;
    this.deployer = deployer;
  }

  construct(sender: Account, contract: string) {
    let block = this.chain.mineBlock([
      Tx.contractCall(
        "executor-dao",
        "construct",
        [types.principal(contract)],
        sender.address
      ),
    ]);
    return block.receipts[0].result;
  }

  executiveAction(sender: Account, contract: string) {
    let block = this.chain.mineBlock([
      Tx.contractCall(
        "age003-emergency-execute",
        "executive-action",
        [types.principal(contract)],
        sender.address
      ),
    ]);
    return block.receipts[0].result;
  }

  transferToken(
    sender: Account,
    token: string,
    amount: number,
    receiver: string,
    memo: ArrayBuffer
  ) {
    let block = this.chain.mineBlock([
      Tx.contractCall(
        token,
        "transfer-fixed",
        [
          types.uint(amount),
          types.principal(sender.address),
          types.principal(receiver),
          types.some(types.buff(memo)),
        ],
        sender.address
      ),
    ]);
    return block.receipts[0].result;
  }

  mintToken(
    sender: Account,
    token: string,
    amount: number,
    receiver: string
  ) {
    let block = this.chain.mineBlock([
      Tx.contractCall(
        token,
        "mint-fixed",
        [
          types.uint(amount),
          types.principal(receiver)
        ],
        sender.address
      ),
    ]);
    return block.receipts[0].result;
  }  
}

/**
 * dao test cases
 *
 */

Clarinet.test({
  name: "DAO: agp003",

  async fn(chain: Chain, accounts: Map<string, Account>) {
    let deployer = accounts.get("deployer")!;
    let DAOTest = new DAO(chain, deployer);

    let result: any = await DAOTest.construct(deployer, bootstrapAddress);
    result.expectOk();

    result = await DAOTest.executiveAction(deployer, agp003Address);
    result.expectOk();

    let call = chain.callReadOnlyFn(
      "alex-launchpad",
      "get-listing-details",
      [types.principal(age000Address)],
      deployer.address
    );
    call.result.expectSome();
  },
});

Clarinet.test({
  name: "DAO: agp005",

  async fn(chain: Chain, accounts: Map<string, Account>) {
    let deployer = accounts.get("deployer")!;
    let DAOTest = new DAO(chain, deployer);

    let result: any = await DAOTest.construct(deployer, bootstrapAddress);
    result.expectOk();

    result = await DAOTest.transferToken(
      deployer,
      "token-wstx",
      1_000_000e8,
      daoAddress,
      new ArrayBuffer(4)
    );
    result.expectOk();

    result = await DAOTest.executiveAction(deployer, agp005Address);
    result.expectOk();

    let call = chain.callReadOnlyFn(
      "fixed-weight-pool",
      "get-pool-contracts",
      [types.uint(1)],
      deployer.address
    );
    result = call.result.expectOk().expectTuple();
    result["token-x"].expectPrincipal(deployer.address + ".token-wstx");
    result["token-y"].expectPrincipal(
      deployer.address + ".age000-governance-token"
    );
    result["weight-x"].expectUint(0.5e8);
    result["weight-y"].expectUint(0.5e8);

    call = chain.callReadOnlyFn(
      "fixed-weight-pool",
      "get-pool-details",
      [
        types.principal(deployer.address + ".token-wstx"),
        types.principal(deployer.address + ".age000-governance-token"),
        types.uint(0.5e8),
        types.uint(0.5e8),
      ],
      deployer.address
    );
    result = call.result.expectOk().expectTuple();
    result["fee-rebate"].expectUint(0.5e8);
    result["fee-rate-x"].expectUint(0.003e8);
    result["fee-rate-y"].expectUint(0.003e8);
    result["oracle-average"].expectUint(0.95e8);
  },
});

Clarinet.test({
  name: "DAO: agp006",

  async fn(chain: Chain, accounts: Map<string, Account>) {
    let deployer = accounts.get("deployer")!;
    let DAOTest = new DAO(chain, deployer);

    let result: any = await DAOTest.construct(deployer, bootstrapAddress);
    result.expectOk();

    result = await DAOTest.executiveAction(deployer, agp006Address);
    result.expectOk();

    let call = chain.callReadOnlyFn(
      "alex-vault",
      "get-flash-loan-fee-rate",
      [],
      deployer.address
    );
    call.result.expectOk().expectUint(0.003e8);
  },
});

Clarinet.test({
  name: "DAO: agp007",

  async fn(chain: Chain, accounts: Map<string, Account>) {
    let deployer = accounts.get("deployer")!;
    let DAOTest = new DAO(chain, deployer);

    let result: any = await DAOTest.construct(deployer, bootstrapAddress);
    result.expectOk();

    result = await DAOTest.executiveAction(deployer, agp007Address);
    result.expectOk();

    let call = chain.callReadOnlyFn(
      "alex-reserve-pool",
      "get-token-halving-cycle",
      [],
      deployer.address
    );
    call.result.expectUint(100);

    call = chain.callReadOnlyFn(
      "alex-reserve-pool",
      "get-activation-threshold",
      [],
      deployer.address
    );
    call.result.expectUint(1);

    call = chain.callReadOnlyFn(
      "alex-reserve-pool",
      "get-activation-delay",
      [],
      deployer.address
    );
    call.result.expectUint(525);

    call = chain.callReadOnlyFn(
      "alex-reserve-pool",
      "get-reward-cycle-length",
      [],
      deployer.address
    );
    call.result.expectUint(525);
  },
});

Clarinet.test({
  name: "DAO: agp008",

  async fn(chain: Chain, accounts: Map<string, Account>) {
    let deployer = accounts.get("deployer")!;
    let DAOTest = new DAO(chain, deployer);

    let result: any = await DAOTest.construct(deployer, bootstrapAddress);
    result.expectOk();

    result = await DAOTest.executiveAction(deployer, agp008Address);
    result.expectOk();

    let call = chain.callReadOnlyFn(
      "alex-reserve-pool",
      "is-token-approved",
      [ types.principal(age000Address) ],
      deployer.address
    );
    call.result.expectBool(true);

    call = chain.callReadOnlyFn(
      "alex-reserve-pool",
      "get-apower-multiplier-in-fixed-or-default",
      [ types.principal(age000Address) ],
      deployer.address
    );
    call.result.expectUint(1e8);
  },
});

Clarinet.test({
  name: "DAO: agp009",

  async fn(chain: Chain, accounts: Map<string, Account>) {
    let deployer = accounts.get("deployer")!;
    let DAOTest = new DAO(chain, deployer);

    let result: any = await DAOTest.construct(deployer, bootstrapAddress);
    result.expectOk();

    result = await DAOTest.transferToken(
      deployer,
      "token-wstx",
      1_000_000e8,
      daoAddress,
      new ArrayBuffer(4)
    );
    result.expectOk();

    result = await DAOTest.mintToken(
      deployer,
      "token-xbtc",
      1_000e8,
      daoAddress
    );
    result.expectOk();    

    result = await DAOTest.executiveAction(deployer, agp009Address);
    result.expectOk();

    let call = chain.callReadOnlyFn(
      "fixed-weight-pool",
      "get-pool-contracts",
      [types.uint(1)],
      deployer.address
    );
    result = call.result.expectOk().expectTuple();
    result["token-x"].expectPrincipal(deployer.address + ".token-wstx");
    result["token-y"].expectPrincipal(deployer.address + ".token-wbtc");
    result["weight-x"].expectUint(0.5e8);
    result["weight-y"].expectUint(0.5e8);

    call = chain.callReadOnlyFn(
      "fixed-weight-pool",
      "get-pool-details",
      [
        types.principal(deployer.address + ".token-wstx"),
        types.principal(deployer.address + ".token-wbtc"),
        types.uint(0.5e8),
        types.uint(0.5e8),
      ],
      deployer.address
    );
    result = call.result.expectOk().expectTuple();
    result["fee-rebate"].expectUint(0.5e8);
    result["fee-rate-x"].expectUint(0.003e8);
    result["fee-rate-y"].expectUint(0.003e8);
    result["oracle-average"].expectUint(0.95e8);
  },
});

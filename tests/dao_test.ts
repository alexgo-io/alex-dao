import {
  Clarinet,
  Tx,
  Chain,
  Account,
  types,
} from "https://deno.land/x/clarinet@v0.14.0/index.ts";
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

const daoAddress = "ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.executor-dao";
const bootstrapAddress =
  "ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.agp000-bootstrap";
const age000Address =
  "ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.age000-governance-token";

const wstxAlex5050Address = "ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.fwp-wstx-alex-50-50";
const wstxWbtc5050Address = "ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.fwp-wstx-wbtc-50-50";
const wstxAlex5050v101Address = "ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.fwp-wstx-alex-50-50-v1-01";
const wstxWbtc5050v101Address = "ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.fwp-wstx-wbtc-50-50-v1-01";

const agp003Address =
  "ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.agp003-launchpad-alex";
const agp005Address =
  "ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.agp005-wstx-alex-50-50";
const agp006Address =
  "ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.agp006-wstx-wbtc-50-50";  
const agp007Address =
  "ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.agp007-wstx-alex-50-50";
const agp008Address =
  "ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.agp008";  
const agp009Address =
  "ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.agp009";  
const agp010Address =
  "ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.agp010";    
const agp011Address =
  "ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.agp011";    
const agp012Address =
  "ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.agp012";      
const agp014Address =
  "ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.agp014";        
const agp015Address =
  "ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.agp015";           


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

    call = chain.callReadOnlyFn(
      "alex-vault",
      "get-flash-loan-fee-rate",
      [],
      deployer.address
    );
    call.result.expectOk().expectUint(0.003e8);

    call = chain.callReadOnlyFn(
      "alex-reserve-pool",
      "get-token-halving-cycle",
      [],
      deployer.address
    );
    call.result.expectUint(100);

    call = chain.callReadOnlyFn(
      "alex-reserve-pool",
      "get-reward-cycle-length",
      [],
      deployer.address
    );
    call.result.expectUint(525);
    
    call = chain.callReadOnlyFn(
      "alex-reserve-pool",
      "is-token-approved",
      [ types.principal(age000Address) ],
      deployer.address
    );
    call.result.expectBool(true);

    call = chain.callReadOnlyFn(
      "alex-reserve-pool",
      "get-activation-block-or-default",
      [ types.principal(age000Address) ],
      deployer.address
    );
    call.result.expectUint(1);    

    call = chain.callReadOnlyFn(
      "alex-reserve-pool",
      "get-apower-multiplier-in-fixed-or-default",
      [ types.principal(age000Address) ],
      deployer.address
    );
    call.result.expectUint(1e8);

    call = chain.callReadOnlyFn(
      "alex-reserve-pool",
      "is-token-approved",
      [ types.principal(wstxAlex5050Address) ],
      deployer.address
    );
    call.result.expectBool(true);

    call = chain.callReadOnlyFn(
      "alex-reserve-pool",
      "get-activation-block-or-default",
      [ types.principal(wstxAlex5050Address) ],
      deployer.address
    );
    call.result.expectUint(1);    

    call = chain.callReadOnlyFn(
      "alex-reserve-pool",
      "get-apower-multiplier-in-fixed-or-default",
      [ types.principal(wstxAlex5050Address) ],
      deployer.address
    );
    call.result.expectUint(0.3e8);    
  },
});

Clarinet.test({
  name: "DAO: agp006",

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

    result = await DAOTest.executiveAction(deployer, agp006Address);
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

    call = chain.callReadOnlyFn(
      "alex-reserve-pool",
      "is-token-approved",
      [ types.principal(wstxWbtc5050Address) ],
      deployer.address
    );
    call.result.expectBool(true);

    call = chain.callReadOnlyFn(
      "alex-reserve-pool",
      "get-activation-block-or-default",
      [ types.principal(wstxWbtc5050Address) ],
      deployer.address
    );
    call.result.expectUint(1);    

    call = chain.callReadOnlyFn(
      "alex-reserve-pool",
      "get-apower-multiplier-in-fixed-or-default",
      [ types.principal(wstxWbtc5050Address) ],
      deployer.address
    );
    call.result.expectUint(0.3e8);    
  },
});

Clarinet.test({
  name: "DAO: agp007",

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

    result = await DAOTest.executiveAction(deployer, agp007Address);
    result.expectOk();
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
  },
});

Clarinet.test({
  name: "DAO: agp009/10/11",

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

    result = await DAOTest.executiveAction(deployer, agp006Address);
    result.expectOk();  

    result = await DAOTest.executiveAction(deployer, agp009Address);
    result.expectOk();   
    result = await DAOTest.executiveAction(deployer, agp010Address);
    result.expectOk();       
    result = await DAOTest.executiveAction(deployer, agp011Address);
    result.expectOk();        
  },
});

Clarinet.test({
  name: "DAO: agp012",

  async fn(chain: Chain, accounts: Map<string, Account>) {
    let deployer = accounts.get("deployer")!;
    let DAOTest = new DAO(chain, deployer);

    let result: any = await DAOTest.construct(deployer, bootstrapAddress);
    result.expectOk();

    result = await DAOTest.transferToken(
      deployer,
      "token-wstx",
      (504_000 + 105_236) * 1e8,
      daoAddress,
      new ArrayBuffer(4)
    );
    result.expectOk();

    result = await DAOTest.mintToken(
      deployer,
      "token-xbtc",
      5e8,
      daoAddress
    );
    result.expectOk();      

    result = await DAOTest.executiveAction(deployer, agp005Address);
    result.expectOk();
    result = await DAOTest.executiveAction(deployer, agp006Address);
    result.expectOk();

    let call = chain.callReadOnlyFn(
      "age000-governance-token",
      "get-balance",
      [ types.principal(deployer.address) ],
      deployer.address
    );
    call.result.expectOk().expectUint(0);

    call = chain.callReadOnlyFn(
      "token-wbtc",
      "get-balance",
      [ types.principal(deployer.address) ],
      deployer.address
    );
    call.result.expectOk().expectUint(0);          

    result = await DAOTest.executiveAction(deployer, agp012Address);
    result.expectOk();

    call = chain.callReadOnlyFn(
      "fixed-weight-pool-v1-01",
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
      "fixed-weight-pool-v1-01",
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
    
    call = chain.callReadOnlyFn(
      "alex-reserve-pool",
      "is-token-approved",
      [ types.principal(wstxAlex5050v101Address) ],
      deployer.address
    );
    call.result.expectBool(true);

    call = chain.callReadOnlyFn(
      "alex-reserve-pool",
      "get-activation-block-or-default",
      [ types.principal(wstxAlex5050v101Address) ],
      deployer.address
    );
    call.result.expectUint(1);    

    call = chain.callReadOnlyFn(
      "alex-reserve-pool",
      "get-apower-multiplier-in-fixed-or-default",
      [ types.principal(wstxAlex5050v101Address) ],
      deployer.address
    );
    call.result.expectUint(0.3e8);

    call = chain.callReadOnlyFn(
      "alex-reserve-pool",
      "get-activation-block-or-default",
      [ types.principal(wstxAlex5050Address) ],
      deployer.address
    );
    assertEquals(call.result, "u340282366920938463463374607431768211455");

    call = chain.callReadOnlyFn(
      "fixed-weight-pool-v1-01",
      "get-pool-contracts",
      [types.uint(2)],
      deployer.address
    );
    result = call.result.expectOk().expectTuple();
    result["token-x"].expectPrincipal(deployer.address + ".token-wstx");
    result["token-y"].expectPrincipal(deployer.address + ".token-wbtc");
    result["weight-x"].expectUint(0.5e8);
    result["weight-y"].expectUint(0.5e8);

    call = chain.callReadOnlyFn(
      "fixed-weight-pool-v1-01",
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
    
    call = chain.callReadOnlyFn(
      "alex-reserve-pool",
      "is-token-approved",
      [ types.principal(wstxWbtc5050v101Address) ],
      deployer.address
    );
    call.result.expectBool(true);

    call = chain.callReadOnlyFn(
      "alex-reserve-pool",
      "get-activation-block-or-default",
      [ types.principal(wstxWbtc5050v101Address) ],
      deployer.address
    );
    call.result.expectUint(1);    

    call = chain.callReadOnlyFn(
      "alex-reserve-pool",
      "get-apower-multiplier-in-fixed-or-default",
      [ types.principal(wstxWbtc5050v101Address) ],
      deployer.address
    );
    call.result.expectUint(0.3e8);

    call = chain.callReadOnlyFn(
      "alex-reserve-pool",
      "get-activation-block-or-default",
      [ types.principal(wstxWbtc5050Address) ],
      deployer.address
    );
    assertEquals(call.result, "u340282366920938463463374607431768211455");
  },
});


Clarinet.test({
  name: "DAO: agp014/15",

  async fn(chain: Chain, accounts: Map<string, Account>) {
    let deployer = accounts.get("deployer")!;
    let DAOTest = new DAO(chain, deployer);

    let result: any = await DAOTest.construct(deployer, bootstrapAddress);
    result.expectOk();

    result = await DAOTest.transferToken(
      deployer,
      "token-wstx",
      (504_000 + 105_236) * 1e8,
      daoAddress,
      new ArrayBuffer(4)
    );
    result.expectOk();

    result = await DAOTest.mintToken(
      deployer,
      "token-xbtc",
      5e8,
      daoAddress
    );
    result.expectOk();      

    result = await DAOTest.executiveAction(deployer, agp005Address);
    result.expectOk();
    result = await DAOTest.executiveAction(deployer, agp006Address);
    result.expectOk();   
    result = await DAOTest.executiveAction(deployer, agp011Address);
    result.expectOk();    
    result = await DAOTest.executiveAction(deployer, agp012Address);
    result.expectOk();
    result = await DAOTest.executiveAction(deployer, agp014Address);
    result.expectOk();    
    result = await DAOTest.executiveAction(deployer, agp015Address);
    result.expectOk();        

    let call = chain.callReadOnlyFn(
      "alex-reserve-pool",
      "get-coinbase-amount-or-default",
      [ 
        types.principal(age000Address),
        types.uint(1)
      ],
      deployer.address
    );
    call.result.expectUint(206400e8);

    call = chain.callReadOnlyFn(
      "alex-reserve-pool",
      "get-coinbase-amount-or-default",
      [ 
        types.principal(wstxAlex5050v101Address),
        types.uint(1)
      ],
      deployer.address
    );
    call.result.expectUint(567600e8);
    
    call = chain.callReadOnlyFn(
      "alex-reserve-pool",
      "get-coinbase-amount-or-default",
      [ 
        types.principal(wstxWbtc5050v101Address),
        types.uint(1)
      ],
      deployer.address
    );
    call.result.expectUint(258000e8);    

  },
});
import { ECPair, networks, payments } from "bitcoinjs-lib";
import * as bitcoinMessage from "bitcoinjs-message";

const main = async (): Promise<any> => {
  const args = process.argv.slice(2);

  if (args.length != 2) {
    console.error(`Usage: npx ts-node ${__filename} <message> <wif>`);
    process.exit(1);
  }

  const message = args[0];
  const wif = args[1];

  const keyPair = ECPair.fromWIF(wif, networks.testnet);
  const signature = bitcoinMessage.sign(
    message,
    keyPair.privateKey,
    keyPair.compressed
  );
  const { address } = payments.p2pkh({
    pubkey: keyPair.publicKey,
    network: networks.testnet,
  });
  const verification = bitcoinMessage.verify(message, address, signature);

  console.log({
    message,
    address,
    signature: signature.toString("base64"),
    verification,
  });
};

main().catch(console.error);

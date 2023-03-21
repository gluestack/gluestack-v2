
import envinfo from 'envinfo';

export default async (): Promise<void> => envinfo
  .run(
    {
      System: ["OS", "CPU"],
      Binaries: [
        "Node",
        "npm",
        "Docker"
      ],
      npmGlobalPackages: [
        "gluestack",
        "hasura-cli"
      ],
    },
    {
      duplicates: true,
      showNotFound: true
    },
  )
  .then(console.log);

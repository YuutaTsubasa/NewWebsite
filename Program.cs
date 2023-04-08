return await Bootstrapper
  .Factory
  .CreateWeb(args)
  .DeployToGitHubPages(
        "YuutaTsubasa",
        "yuutatsubasa.github.io",
        Config.FromSetting<string>("GITHUB_TOKEN")
    )
  .RunAsync();
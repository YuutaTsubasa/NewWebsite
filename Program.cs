return await Bootstrapper
  .Factory
  .CreateWeb(args)
  .DeployToGitHubPages(
        "YuutaTsubasa",
        "NewWebsite",
        Config.FromSetting<string>("GITHUB_TOKEN")
    )
  .RunAsync();
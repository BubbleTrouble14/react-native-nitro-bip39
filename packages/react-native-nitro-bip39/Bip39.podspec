require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "Bip39"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => min_ios_version_supported }
  s.source       = { :git => "https://github.com/mrousavy/nitro.git", :tag => "#{s.version}" }

  s.source_files = [
    # Implementation (Swift)
    "ios/**/*.{swift}",
    # Autolinking/Registration (Objective-C++)
    "ios/**/*.{m,mm}",
    # Implementation (C++ objects)
    "cpp/**/*.{hpp,cpp}",
    "bip39_cpp/src/*.{cpp}",
    "bip39_cpp/include/*.{h}"
  ]

  s.dependency "OpenSSL-Universal"

  s.vendored_frameworks = "ios/Clibutf8proc.xcframework"

  load 'nitrogen/generated/ios/Bip39+autolinking.rb'
  add_nitrogen_files(s)

  install_modules_dependencies(s)
end

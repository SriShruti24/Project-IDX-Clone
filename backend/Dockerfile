FROM ubuntu:20.04

# Setup user
RUN useradd -ms /bin/bash sandbox

# Setup working directory
WORKDIR /home/sandbox

# Update system and install basic tools
RUN apt update && apt upgrade -y
RUN apt install -y nano curl sudo

# Install Node.js (v22) - fixed mirror
RUN curl -fsSL https://deb.nodesource.com/setup_current.x | bash - && apt-get install -y nodejs

# Configure terminal to show current directory
RUN echo "PS1='\\w\\$ '" >> /home/sandbox/.bashrc

# Add alias so npm works without manual install
RUN echo "alias dev='npm install && npm run dev'" >> /home/sandbox/.bashrc

# Create app directory and give sandbox full ownership
RUN mkdir -p /home/sandbox/app && chown -R sandbox:sandbox /home/sandbox

# Switch to sandbox user (important!)
USER sandbox

# Final working directory
WORKDIR /home/sandbox/app

# Start interactive bash
CMD ["/bin/bash"]

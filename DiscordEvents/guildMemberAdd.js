module.exports = (Client, member) => {
    let guestRole = member.guild.roles.cache.get('1146691239618560010');
    if (guestRole) {
        member.roles.add(guestRole);
    }
}